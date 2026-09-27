import { describe, expect, it, vi, beforeEach } from "vitest";
import { Request, NextFunction, Response } from "express";
import { authenticate } from "../../src/middleware/authenticate";
import jwt from "jsonwebtoken";
import { getUserById } from "../../src/models/userModel";

vi.mock("../../src/models/userModel.js");
vi.mock("jsonwebtoken");
describe("authenticate middleware", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_ACCESS_SECRET", "test-secret");
  });
  const next = vi.fn() as NextFunction;
  const res = {} as Response;
  const mockUser = {
    id: 1,
    username: "inactiveUser",
    email: "",
    phone: "",
    user_role: "student" as const,
    default_hourly_rate: 10,
    is_active: true,
    created_at: new Date(),
  };
  it("should throw 401 Access toke nmissing if no access token in request ", async () => {
    const reqWithoutToken = { cookies: { accessToken: "" } } as Request;

    await expect(() =>
      authenticate(reqWithoutToken, res, next),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Access token is missing",
    });
    expect(next).not.toHaveBeenCalled();
  });
  it("should throw 401 Invalid access token if access token is not an object", async () => {
    const reqWithInvalidToken = {
      cookies: { accessToken: "invalidToken" },
    } as Request;
    vi.mocked(jwt.verify).mockImplementation(() => "");

    await expect(() =>
      authenticate(reqWithInvalidToken, res, next),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid access token",
    });
    expect(next).not.toHaveBeenCalled();
  });
  it("should throw 401 Invalid access token if access token is not valid", async () => {
    const reqWithInvalidToken = {
      cookies: { accessToken: "invalidToken" },
    } as Request;
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error("jwt expired");
    });

    await expect(() =>
      authenticate(reqWithInvalidToken, res, next),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid access token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw 404 User not found if user does not exist", async () => {
    const reqWithValidTokenButNonExistentUser = {
      cookies: { accessToken: "validTokenForNonExistentUser" },
    } as Request;
    vi.mocked(jwt.verify).mockImplementation(() => {
      return { userId: 999 }; // Mocking a decoded token with a userId that does not exist
    });
    vi.mocked(getUserById).mockResolvedValue(null); // Mocking getUserById to return null for non-existent user

    await expect(
      authenticate(reqWithValidTokenButNonExistentUser, res, next),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "User not found",
    });
    expect(next).not.toHaveBeenCalled();
  });
  it("should throw 403 User is inactive if user is inactive", async () => {
    const reqWithValidTokenForInactiveUser = {
      cookies: { accessToken: "validTokenForInactiveUser" },
    } as Request;

    vi.mocked(jwt.verify).mockImplementation(() => {
      return { userId: 1 }; // Mocking a decoded token with a userId that exists
    });
    vi.mocked(getUserById).mockResolvedValue({ ...mockUser, is_active: false }); // Mocking getUserById to return an inactive user

    await expect(
      authenticate(reqWithValidTokenForInactiveUser, res, next),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "User is inactive",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() and attach user info to req if access token is valid and user is active", async () => {
    const reqWithValidTokenForActiveUser = {
      cookies: { accessToken: "validTokenForActiveUser" },
    } as Request & {
      user?: {
        id: string;
        role: typeof mockUser.user_role;
      };
    };

    vi.mocked(jwt.verify).mockImplementation(() => {
      return { userId: 1 }; // Mocking a decoded token with a userId that exists
    });
    vi.mocked(getUserById).mockResolvedValue(mockUser);

    await authenticate(reqWithValidTokenForActiveUser, res, next);

    expect(next).toHaveBeenCalled();
    expect(reqWithValidTokenForActiveUser.user).toEqual({
      id: "1",
      role: "student",
    });
  });
});
