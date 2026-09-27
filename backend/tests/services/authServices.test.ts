import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserWithHashedPasswordType } from "../../src/types/User";
import * as AuthService from "../../src/services/authServices";
import * as AuthModel from "../../src/models/authModel";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
vi.mock("../../src/models/authModel.js");
vi.mock("argon2");
vi.mock("jsonwebtoken");
describe("authenticateUser", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_ACCESS_SECRET", "test-secret");
    vi.stubEnv("ACCESS_TOKEN_EXPIRATION", "15");
  });
  const mockUser: UserWithHashedPasswordType = {
    id: 1,
    username: "testuser",
    password_hash: "hashedpassword",
    user_role: "student",
    is_active: true,
    email: "",
    phone: "",
    created_at: new Date(),
    default_hourly_rate: 12,
  };
  const mockPassword = "password";
  const fakeAccessToken = "mockAccessToken";

  it("should throw error 400 when username or password is missing", async () => {
    await expect(
      AuthService.authenticateUser("", mockPassword),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Username and password are required",
    });
  });

  it("should throw error 401 when provided with a username that  doesn't exist", async () => {
    vi.mocked(AuthModel.getUserByUsername).mockResolvedValue(null);

    await expect(
      AuthService.authenticateUser("nonexistentuser", mockPassword),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid username or password",
    });
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should throw error 401 when provided with an incorrect password", async () => {
    vi.mocked(AuthModel.getUserByUsername).mockResolvedValue(mockUser);
    vi.mocked(argon2.verify).mockResolvedValue(false);

    await expect(
      AuthService.authenticateUser(mockUser.username, "wrongpassword"),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid username or password",
    });
    expect(jwt.sign).not.toHaveBeenCalled();
  });
  it("should return an access token when provided with correct username and password", async () => {
    vi.mocked(AuthModel.getUserByUsername).mockResolvedValue(mockUser);
    vi.mocked(argon2.verify).mockResolvedValue(true);
    vi.mocked(jwt.sign).mockImplementation(() => fakeAccessToken);

    const result = await AuthService.authenticateUser(
      mockUser.username,
      mockPassword,
    );

    expect(result).toBe(fakeAccessToken);
    expect(argon2.verify).toHaveBeenCalledWith("hashedpassword", "password");

    expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, "test-secret", {
      expiresIn: 15 * 60,
    });
  });
});
