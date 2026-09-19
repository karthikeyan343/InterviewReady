import mongoose, { Document, Schema, Types } from "mongoose";

export interface IInterview extends Document {
  userId: Types.ObjectId;
  resumeId: Types.ObjectId;
  role: string;
  interviewType: "Technical" | "Behavioral" | "Mixed";
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Not Started" | "In Progress" | "Completed" | "Abandoned";
  startedAt?: Date;
  endedAt?: Date;
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
      enum: ["Technical", "Behavioral", "Mixed"],
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
      ],
      default: "Not Started",
    },

    startedAt: {
      type: Date,
    },

    endedAt: {
      type: Date,
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