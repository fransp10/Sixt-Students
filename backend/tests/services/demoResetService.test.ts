import { describe, it, expect, vi, beforeEach } from "vitest";
import resetDemo from "../../src/services/demoResetService.js";

// vi.mock is hoisted above the imports, so the fakes it uses must be created with vi.hoisted too.
// `query` answers the four queries resetDemo runs, in order:
// wipe, seed, select the contracts, update their file sizes.
const { query, release, connect, end, send } = vi.hoisted(() => ({
  query: vi.fn(),
  release: vi.fn(),
  connect: vi.fn(),
  end: vi.fn(),
  send: vi.fn(),
}));
vi.mock("../../src/db/db.js", () => ({ default: { connect, end } }));
vi.mock("../../src/config/s3.js", () => ({
  s3: { send },
  S3_BUCKET: "test-bucket",
}));

const contract = {
  id: 7,
  file_key: "contracts/3/2026-10.pdf",
  student_name: "Ana Horvat",
  month: "2026-10",
};

describe("resetDemo", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    connect.mockResolvedValue({ query, release });
    query
      .mockResolvedValueOnce({}) // wipe
      .mockResolvedValueOnce({}) // seed
      .mockResolvedValueOnce({ rows: [contract] }) // select contracts
      .mockResolvedValueOnce({}); // update file sizes
    send.mockResolvedValue({});
  });

  // This function wipes a database, so refusing to run is the behaviour that matters most:
  // anything but exactly "true" must stop before the database or S3 are touched.
  describe("when DEMO_MODE is not 'true'", () => {
    it.each([undefined, "false", "", "1", "TRUE"])(
      "refuses to run and touches nothing (DEMO_MODE = %j)",
      async (value) => {
        vi.stubEnv("DEMO_MODE", value);

        await expect(resetDemo()).rejects.toThrow("Refusing to reset");

        expect(connect).not.toHaveBeenCalled();
        expect(send).not.toHaveBeenCalled();
      },
    );
  });

  describe("when DEMO_MODE is 'true'", () => {
    beforeEach(() => {
      vi.stubEnv("DEMO_MODE", "true");
    });

    // the SQL files are read from disk, so this also fails if the folder path is wrong
    it("wipes the data and then seeds it, from the SQL files", async () => {
      await resetDemo();

      const [wipeSql] = query.mock.calls[0];
      const [seedSql] = query.mock.calls[1];
      expect(wipeSql).toContain("TRUNCATE");
      expect(seedSql).toContain("demo.admin");
    });

    it("uploads one PDF per contract to the contract's S3 key", async () => {
      await resetDemo();

      expect(send).toHaveBeenCalledTimes(1);
      const { input } = send.mock.calls[0][0];
      expect(input).toMatchObject({
        Bucket: "test-bucket",
        Key: contract.file_key,
        ContentType: "application/pdf",
      });
      expect(input.Body.subarray(0, 4).toString()).toBe("%PDF");
    });

    it("stores the real size of every uploaded PDF", async () => {
      await resetDemo();

      const { input } = send.mock.calls[0][0];
      const [updateSql, params] = query.mock.calls[3];
      expect(updateSql).toContain("UPDATE contracts");
      expect(params).toEqual([[contract.id], [input.Body.length]]);
    });

    it("releases the client but leaves the pool open for the server", async () => {
      await resetDemo();

      expect(release).toHaveBeenCalledTimes(1);
      expect(end).not.toHaveBeenCalled();
    });

    it("still releases the client when a step fails, and stops there", async () => {
      query.mockReset();
      query
        .mockResolvedValueOnce({}) // wipe works
        .mockRejectedValueOnce(new Error("seed failed")); // seed fails

      await expect(resetDemo()).rejects.toThrow("seed failed");

      expect(release).toHaveBeenCalledTimes(1);
      expect(send).not.toHaveBeenCalled();
      expect(end).not.toHaveBeenCalled();
    });
  });
});
