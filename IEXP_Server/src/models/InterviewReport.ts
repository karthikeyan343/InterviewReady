import mongoose, { Document, Schema } from "mongoose";

export interface IInterviewReport extends Document {
  interviewId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  overallScore: number;

  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;

  strengths: string[];
  weaknesses: string[];
  suggestions: string[];

  summary: string;

  status?: "preparing" | "ready" | "failed";

  createdAt: Date;
  updatedAt: Date;
}

const interviewReportSchema = new Schema<IInterviewReport>(
  {
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },

    technicalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },

    communicationScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },

    problemSolvingScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    summary: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["preparing", "ready", "failed"],
      default: "ready",
    },
  },
  {
    timestamps: true,
  }
);

const InterviewReport = mongoose.model<IInterviewReport>(
  "InterviewReport",
  interviewReportSchema
);

export default InterviewReport;