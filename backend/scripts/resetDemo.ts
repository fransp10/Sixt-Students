// Resets the demo environment: wipes the data, seeds it again, and uploads a contract PDF
// to S3 for every seeded contract.
// Usage: npm run demo:reset
//
// !! DESTRUCTIVE !! It only runs when DEMO_MODE=true, which must be set ONLY on the demo
// environment (its own database and its own S3 bucket).
import "dotenv/config";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import type { PoolClient } from "pg";
import pool from "../src/db/db.js";
import { s3, S3_BUCKET } from "../src/config/s3.js";
import { buildContractPdf } from "./buildContractPdf.js";

const DB_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../db");
const UPLOADS_AT_ONCE = 10;

type ContractRow = {
  id: number;
  file_key: string;
  student_name: string;
  month: string; // YYYY-MM
};

async function runSqlFile(client: PoolClient, fileName: string) {
  await client.query(readFileSync(resolve(DB_DIR, fileName), "utf8"));
}

// Builds the PDF for one contract, uploads it, and returns its size in bytes.
async function uploadContract(contract: ContractRow): Promise<number> {
  const pdf = await buildContractPdf(contract.student_name, contract.month);
  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: contract.file_key,
      Body: pdf,
      ContentType: "application/pdf",
    }),
  );
  return pdf.length;
}

async function resetDemo() {
  if (process.env.DEMO_MODE !== "true") {
    throw new Error(
      "Refusing to reset: this wipes the database. Set DEMO_MODE=true, and only on the demo environment.",
    );
  }

  const client = await pool.connect();
  try {
    console.log("Wiping demo data...");
    await runSqlFile(client, "wipe_demo_data.sql");

    console.log("Seeding demo data...");
    await runSqlFile(client, "seed_demo.sql");

    const { rows: contracts } = await client.query<ContractRow>(
      `SELECT c.id,
              c.file_key,
              u.first_name || ' ' || u.last_name AS student_name,
              to_char(c.contract_month, 'YYYY-MM') AS month
       FROM contracts c
       JOIN users u ON u.id = c.user_id
       ORDER BY c.id`,
    );

    console.log(`Uploading ${contracts.length} contract PDFs to S3...`);
    const sizes: number[] = []; // sizes[i] belongs to contracts[i]
    for (let i = 0; i < contracts.length; i += UPLOADS_AT_ONCE) {
      const batch = contracts.slice(i, i + UPLOADS_AT_ONCE);
      sizes.push(...(await Promise.all(batch.map(uploadContract))));
    }

    // the seed leaves file_size at 0, now that the files exist store their real sizes
    await client.query(
      `UPDATE contracts c
       SET file_size = v.size
       FROM unnest($1::int[], $2::int[]) AS v(id, size)
       WHERE c.id = v.id`,
      [contracts.map((contract) => contract.id), sizes],
    );

    console.log("Demo reset done.");
  } finally {
    client.release();
    await pool.end();
  }
}

resetDemo().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
