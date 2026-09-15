import { Request, Response } from "express";
import AppError from "../errors/AppError.js";
import * as Users from "../models/userModel.js";
import {
  CreateUserReqBodyType,
  UserWithoutPasswordType,
  UserWithPasswordType,
} from "../types/User.js";
import * as UserServices from "../services/userServices.js";
export async function getUsers(req: Request, res: Response): Promise<void> {
  const allUsers: UserWithoutPasswordType[] = await Users.getUsers();

  res.status(200).json(allUsers);
}

export async function getUserById(
  req: Request<{ userId: string }>,
  res: Response,
): Promise<void> {
  const { userId } = req.params;

  const user: UserWithoutPasswordType | null = await Users.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json(user);
}

export async function createUser(
  req: Request<{}, unknown, CreateUserReqBodyType>,
  res: Response<UserWithPasswordType>,
): Promise<void> {
  const { username, user_role, default_hourly_rate } = req.body;

  if (!username) {
    throw new AppError("Missing username field", 400);
  }
  if (!default_hourly_rate) {
    throw new AppError("Missing defaultHourlyRate field", 400);
  }
  if (!user_role) {
    throw new AppError("Missing userRole field", 400);
  }

  const result: UserWithPasswordType = await UserServices.createUser(req.body);
  res.status(201).json(result);
}

export async function updateUser(
  req: Request<{ userId: string }>,
  res: Response<UserWithoutPasswordType>,
): Promise<void> {
  const { userId } = req.params;
  const result: UserWithoutPasswordType = await Users.updateUser(
    userId,
    req.body,
  );
  if (!result) {
    throw new AppError("No valid fields to update", 400);
  }
  res.status(200).json(result);
}

export async function deactivateUser(
  req: Request<{ userId: string }>,
  res: Response,
): Promise<void> {
  const { userId } = req.params;
  const result: UserWithoutPasswordType = await Users.deactivateUser(userId);

  if (!result) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ message: "User deactivated successfully" });
}

export async function activateUser(
  req: Request<{ userId: string }>,
  res: Response,
): Promise<void> {
  const { userId } = req.params;

  const result: UserWithoutPasswordType = await Users.activateUser(userId);

  if (!result) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ message: "User activated successfully" });
}
