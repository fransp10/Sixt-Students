import { Request, Response } from "express";
import { describe, it, expect, vi } from "vitest";
import { blockInDemo } from "../../src/middleware/blockInDemo.js";

describe("blockInDemo middleware", () => {
  const req = {} as Request;
  const res = {} as Response;
  const next = vi.fn();

  it("throws a 403 and does not call next when DEMO_MODE is 'true'", async () => {
    vi.stubEnv("DEMO_MODE", "true");

    // the arrow function makes this work whether the middleware is sync or async
    await expect(async () => blockInDemo(req, res, next)).rejects.toMatchObject({
      message: "This action is not allowed in demo mode",
      statusCode: 403,
    });

    expect(next).not.toHaveBeenCalled();
  });

  // unset, 'false', and anything else must let the request through: blocking is opt-in
  it.each([undefined, "false", "", "1", "TRUE"])(
    "calls next when DEMO_MODE is %j",
    async (value) => {
      vi.stubEnv("DEMO_MODE", value);

      await blockInDemo(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    },
  );
});
