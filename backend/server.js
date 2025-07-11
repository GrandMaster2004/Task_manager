import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";

import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRouter.js";

// const allowedOrigins = ["http://localhost:5173"];
const allowedOrigins = ["https://task-manager-ase4.vercel.app"];

const app = express();
const port = process.env.PORT || 4000;

// MIddleware
app.use(
  cors({
    origin: allowedOrigins,
    // credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connect
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);
app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
