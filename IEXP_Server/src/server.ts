import "dotenv/config";

import express, {
  type Express,
  type Request,
  type Response,
} from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import interviewReportRoutes from "./routes/interviewReportRoutes.js";
import liveInterviewRoutes from "./routes/liveInterviewRoutes.js";

import connectDB from "./config/database.js";

const app: Express = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/interviews", interviewRoutes);

app.use("/api/interviews", interviewReportRoutes);

app.use("/api/interviews", liveInterviewRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "InterviewReady API is running",
  });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "InterviewReady server is ready",
  });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();