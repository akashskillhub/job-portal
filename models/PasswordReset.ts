import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPasswordReset extends Document {
  email: string;
  token: string;
  role: string;
  expiresAt: Date;
  createdAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "college", "company", "student"],
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index to auto-delete expired tokens
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset: Model<IPasswordReset> =
  mongoose.models.PasswordReset ||
  mongoose.model<IPasswordReset>("PasswordReset", PasswordResetSchema);

export default PasswordReset;
