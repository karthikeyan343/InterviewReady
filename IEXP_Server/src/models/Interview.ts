import mongoose, { Document, Schema, Types } from "mongoose";

export interface IInterview extends Document {
  userId: Types.ObjectId;
  resumeId: Types.ObjectId;
  role: string;
  interviewType: "Technical" | "Resume-Based" | "Mixed" | "Behavioral";
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Not Started" | "In Progress" | "Completed" | "Abandoned" | "Left";
  activeSessionId?: string | null;
  activeSessionLastHeartbeat?: Date | null;
  activeSessionDeviceId?: string | null;
  startedAt?: Date;
  endedAt?: Date;
  activeDurationSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    interviewType: {
      type: String,
      enum: ["Technical", "Resume-Based", "Mixed", "Behavioral"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
        "Abandoned",
        "Left",
      ],
      default: "Not Started",
    },

    activeSessionId: {
      type: String,
      default: null,
    },

    activeSessionLastHeartbeat: {
      type: Date,
      default: null,
    },

    activeSessionDeviceId: {
      type: String,
      default: null,
    },

    startedAt: {
      type: Date,
    },

    endedAt: {
      type: Date,
    },

    activeDurationSeconds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model<IInterview>(
  "Interview",
  interviewSchema
);

export default Interview;