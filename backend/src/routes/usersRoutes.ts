import express from "express";
import {
  activateUser,
  createUser,
  deactivateUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/usersController.js";
const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.get("/:userId", getUserById);

userRouter.post("/", createUser);

userRouter.patch("/:userId", updateUser);

userRouter.patch("/:userId/deactivate", deactivateUser);

userRouter.patch("/:userId/activate", activateUser);

export default userRouter;
