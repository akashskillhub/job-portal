import mongoose, { Document, Model, Schema } from "mongoose";

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  status: "applied" | "shortlisted" | "rejected" | "hired";
  appliedAt: Date;
  statusUpdatedAt: Date;
  coverLetter?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "hired"],
      default: "applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    coverLetter: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student can only apply once to a job
ApplicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;