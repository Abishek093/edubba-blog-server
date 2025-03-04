import mongoose, { model, Schema } from "mongoose";
import { IBlog } from "../../../entities/IBlog";

const blogSchema = new Schema<IBlog>({
    title: { type: String, required: true },
    brief: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    userId: { type: String, required: true },
    tags: { type: [String], default: [] },
    author: { type: String, required: true }, 
    isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const BlogModel = mongoose.model<IBlog>('Blog', blogSchema);

export default BlogModel;