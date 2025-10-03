import mongoose, { Document, Model, Schema } from "mongoose";

export interface IJob extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  jobType: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  allowedColleges: mongoose.Types.ObjectId[];
  allowedStreams: string[];
  minCGPA: number;
  applicationDeadline: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "INR" },
    },
    allowedColleges: {
      type: [Schema.Types.ObjectId],
      ref: "College",
      default: [],
    },
    allowedStreams: {
      type: [String],
      required: true,
    },
    minCGPA: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);

export default Job;