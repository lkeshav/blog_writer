import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: Types.ObjectId;
  blog: Types.ObjectId;
  parentComment?: Types.ObjectId; // For nested comments
  likes?: number;
}

const CommentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
