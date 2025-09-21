import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILike extends Document {
  user: Types.ObjectId;
  blog: Types.ObjectId;
}

const LikeSchema = new Schema<ILike>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true }
}, { timestamps: true });

// Ensure one like per user per blog
LikeSchema.index({ user: 1, blog: 1 }, { unique: true });

export const Like = mongoose.model<ILike>('Like', LikeSchema);
