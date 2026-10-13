import express from "express";
import * as userController from "../controllers/usersController.js";
const userRouter = express.Router();

userRouter.get("/", userController.getUsers);

userRouter.get("/:userId", userController.getUserById);

userRouter.post("/", userController.createUser);

userRouter.patch("/:userId", userController.updateUser);

userRouter.patch("/:userId/deactivate", userController.deactivateUser);

userRouter.patch("/:userId/activate", userController.activateUser);

userRouter.get("/:userId/stats", userController.getStatsForUser);

userRouter.get(
  "/:userId/shift-assignments",
  userController.getShiftAssignmentsByUserId,
);

userRouter.post(
  "/:userId/password-reset",
  userController.sendPasswordResetLink,
);

export default userRouter;
