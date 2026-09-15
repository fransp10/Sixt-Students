import crypto from "crypto";
import argon2 from "argon2";
import { DatabaseError } from "pg";
import * as Users from "../models/userModel.js";
import { CreateUserReqBodyType, UserWithPasswordType } from "../types/User.js";
import AppError from "../errors/AppError.js";
export async function createUser(
  data: CreateUserReqBodyType,
): Promise<UserWithPasswordType> {
  try {
    const password = crypto.randomBytes(12).toString("base64url");
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    const user = await Users.createUser({
      ...data,
      password_hash: passwordHash,
    });

    return { ...user, password };
  } catch (error) {
    if (
      error instanceof DatabaseError &&
      error.code === "23505" &&
      error.constraint === "users_username_key"
    ) {
      throw new AppError("Username already exists", 409);
    }
    throw error;
  }
}
