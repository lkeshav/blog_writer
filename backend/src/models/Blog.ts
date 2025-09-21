import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  tags?: string[];
  coverImageUrl?: string;
  likes?: number;
  comments?: number;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  coverImageUrl: { type: String },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 }
}, { timestamps: true });

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);


