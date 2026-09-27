import { Request, Response } from "express";
import { expect, vi, describe, it } from "vitest";
import "../../src/types/RequestWithUserInfo.js";
import { requireAdmin } from "../../src/middleware/requireAdmin.js";

describe("requireAdmin middleware", () => {
  const res = {} as Response;
  const next = vi.fn();

  it("should throw error if user role is not admin", () => {
    const reqWithNonAdminRole = {
      user: { id: "1", role: "student" },
    } as Request;
    expect(() => {
      requireAdmin(reqWithNonAdminRole, res, next);
    }).toThrow(
      expect.objectContaining({
        message: "Admin privileges required",
        statusCode: 403,
      }),
    );

    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if user role is admin", () => {
    const reqAdmin = { user: { id: "1", role: "admin" } } as Request;
    requireAdmin(reqAdmin, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should throw error if user role is not present in request", () => {
    const requestWithoutRole = { user: { id: "1" } } as Request;
    expect(() => {
      requireAdmin(requestWithoutRole, res, next);
    }).toThrow(
      expect.objectContaining({
        message: "Admin privileges required",
        statusCode: 403,
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw error if there is no user in the request", () => {
    const requestWithoutUser = {} as Request;
    expect(() => {
      requireAdmin(requestWithoutUser, res, next);
    }).toThrow("Admin privileges required");
    expect(next).not.toHaveBeenCalled();
  });
});
