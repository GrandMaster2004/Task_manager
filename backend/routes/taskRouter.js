import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createTask,
  deletaTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

// import {}

const taskRouter = express.Router();

taskRouter
  .route("/gp")
  .get(authMiddleware, getTasks)
  .post(authMiddleware, createTask);

taskRouter
  .route("/:id/gp")
  .get(authMiddleware, getTaskById)
  .post(authMiddleware, updateTask)
  .delete(authMiddleware, deletaTask);

export default taskRouter;
