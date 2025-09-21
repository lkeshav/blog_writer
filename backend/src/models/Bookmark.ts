import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBookmark extends Document {
  user: Types.ObjectId;
  blog: Types.ObjectId;
}

const BookmarkSchema = new Schema<IBookmark>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true }
}, { timestamps: true });

// Ensure one bookmark per user per blog
BookmarkSchema.index({ user: 1, blog: 1 }, { unique: true });

export const Bookmark = mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
