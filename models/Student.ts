import mongoose, { Document, Model, Schema } from "mongoose";

export interface IStudent extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  collegeId: mongoose.Types.ObjectId;
  rollNumber: string;
  stream: string;
  graduationYear: number;
  cgpa: number;
  phone: string;
  resumeUrl?: string;
  skills: string[];
  isEmailVerified?: boolean;
  role: "student";
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    collegeId: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    stream: {
      type: String,
      required: true,
      enum: [
        "Computer Science",
        "Information Technology",
        "Electronics",
        "Mechanical",
        "Civil",
        "Electrical",
        "Chemical",
        "Biotechnology",
        "Other",
      ],
    },
    graduationYear: {
      type: Number,
      required: true,
    },
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    phone: {
      type: String,
      required: true,
    },
    resumeUrl: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "student",
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique roll numbers per college
StudentSchema.index({ collegeId: 1, rollNumber: 1 }, { unique: true });

const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;