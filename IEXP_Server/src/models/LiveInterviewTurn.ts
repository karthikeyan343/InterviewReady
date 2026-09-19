import mongoose, { Document, Schema } from "mongoose";

export interface ILiveInterviewTurn extends Document {
  interviewId: mongoose.Types.ObjectId;

  sequence: number;

  speaker: "interviewer" | "candidate";

  text: string;

  isQuestion: boolean;

  timestamp: Date;

  createdAt: Date;
  updatedAt: Date;
}

const liveInterviewTurnSchema =
  new Schema<ILiveInterviewTurn>(
    {
      interviewId: {
        type: Schema.Types.ObjectId,
        ref: "Interview",
        required: true,
        index: true,
      },

      sequence: {
        type: Number,
        required: true,
        min: 1,
      },

      speaker: {
        type: String,
        enum: [
          "interviewer",
          "candidate",
        ],
        required: true,
      },

      text: {
        type: String,
        required: true,
        trim: true,
      },

      isQuestion: {
        type: Boolean,
        required: true,
        default: false,
      },

      timestamp: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

liveInterviewTurnSchema.index(
  {
    interviewId: 1,
    sequence: 1,
  },
  {
    unique: true,
  }
);

const LiveInterviewTurn =
  mongoose.model<ILiveInterviewTurn>(
    "LiveInterviewTurn",
    liveInterviewTurnSchema
  );

export default LiveInterviewTurn;