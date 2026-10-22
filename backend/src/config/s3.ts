import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.AWS_REGION || !process.env.S3_BUCKET_NAME) {
  throw new Error(
    "AWS_REGION and S3_BUCKET_NAME must be defined in the environment variables.",
  );
}

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

export const S3_BUCKET = process.env.S3_BUCKET_NAME;
