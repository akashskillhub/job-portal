import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICollege extends Document {
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  establishedYear: number;
  role: "college";
  createdAt: Date;
  updatedAt: Date;
}

const CollegeSchema = new Schema<ICollege>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    establishedYear: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "college",
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

const College: Model<ICollege> =
  mongoose.models.College || mongoose.model<ICollege>("College", CollegeSchema);

export default College;