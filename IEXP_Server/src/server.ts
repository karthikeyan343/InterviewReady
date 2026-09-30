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

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
];

const envAllowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((s) => s.trim().replace(/\/$/, ""))
  : [];

const allowedOriginsSet = new Set([...defaultAllowedOrigins, ...envAllowedOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, server-to-server, curl)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (allowedOriginsSet.has(normalizedOrigin)) {
        return callback(null, true);
      }

      // Allow all Vercel preview and production deployments (*.vercel.app)
      if (/^https:\/\/[a-zA-Z0-9._-]+\.vercel\.app$/.test(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);

// Cross-Origin-Opener-Policy header to permit Google Sign-In popup communication
app.use((_req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

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