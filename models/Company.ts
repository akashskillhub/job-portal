import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompany extends Document {
  name: string;
  email: string;
  password: string;
  website?: string;
  industry: string;
  size: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  isApproved: boolean;
  role: "company";
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
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
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    description: {
      type: String,
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
    isApproved: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "company",
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);

export default Company;