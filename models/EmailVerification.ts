import mongoose, { Schema, Document } from "mongoose";

export interface IEmailVerification extends Document {
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const EmailVerificationSchema = new Schema<IEmailVerification>({
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
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-delete expired tokens
EmailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.EmailVerification || mongoose.model<IEmailVerification>("EmailVerification", EmailVerificationSchema);
