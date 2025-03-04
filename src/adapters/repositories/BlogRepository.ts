import { injectable } from "tsyringe";
import { IBlogRepository } from "../../interfaces/blog/IBlogRepository";
import BlogModel from "./models/BlogModel";
import { IBlog, IBlogCreate } from '../../entities/IBlog'
import CustomError from "../../errors/customError";
import HttpStatusCode from "../../errors/httpStatusCodes";
import { UserModel } from "./models/UserModel";
import { SearchBlogsParams, SearchBlogsResponse } from "../../types/Blog";

@injectable()
export class BlogRepository implements IBlogRepository {
  async createBlog(blogData: IBlogCreate): Promise<IBlog> {
    try {
      const newBlog = new BlogModel({
        ...blogData,
        isPublished: true // Default to published
      });

      const savedBlog = await newBlog.save();
      return savedBlog.toObject();
    } catch (error) {
      throw error instanceof CustomError
        ? error
        : new CustomError(
          error instanceof Error ? error.message : 'Failed to create blog',
          HttpStatusCode.INTERNAL_SERVER
        );
    }
  }

  async getBlogById(blogId: string): Promise<IBlog | null> {
    try {
      const blog = await BlogModel.findById(blogId);
      return blog ? blog.toObject() : null;
    } catch (error) {
      throw error instanceof CustomError
        ? error
        : new CustomError(
          error instanceof Error ? error.message : 'Failed to get blog',
          HttpStatusCode.INTERNAL_SERVER
        );
    }
  }

  async getUserBlogs(userId: string): Promise<IBlog[]> {
    try {
      const blogs = await BlogModel.find({ userId });
      return blogs.map(blog => blog.toObject());
    } catch (error) {
      throw error instanceof CustomError
        ? error
        : new CustomError(
          error instanceof Error ? error.message : 'Failed to get user blogs',
          HttpStatusCode.INTERNAL_SERVER
        );
    }
  }

  async getAllPublishedBlogs(): Promise<IBlog[]> {
    try {
      const blogs = await BlogModel.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .lean();

      const userIds = [...new Set(blogs.map(blog => blog.userId))];

      const users = await UserModel.find({ _id: { $in: userIds } })
        .select('username profilePicture profession')
        .lean();

      const userMap = new Map(users.map(user => [user._id.toString(), user]));

      return blogs.map(blog => {
        const user = userMap.get(blog.userId);
        return {
          ...blog,
          authorDetails: user ? {
            profilePicture: user.profilePicture,
            profession: user.profession
          } : null
        };
      });
    } catch (error) {
      throw error instanceof CustomError
        ? error
        : new CustomError(
          error instanceof Error ? error.message : 'Failed to get published blogs',
          HttpStatusCode.INTERNAL_SERVER
        );
    }
  }

  async updateBlog(blogId: string, updateData: Partial<IBlog>): Promise<IBlog | null> {
    try {
      const updatedBlog = await BlogModel.findByIdAndUpdate(
        blogId,
        { $set: updateData },
        { new: true }
      );

      return updatedBlog ? updatedBlog.toObject() : null;
    } catch (error) {
      throw error instanceof CustomError
        ? error
        : new CustomError(
          error instanceof Error ? error.message : 'Failed to update blog',
          HttpStatusCode.INTERNAL_SERVER
        );
    }
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    try {
      const result = await BlogModel.findByIdAndDelete(blogId);
      return !!result;
    } catch (error) {
      throw error instanceof CustomError
        ? error
        : new CustomError(
          error instanceof Error ? error.message : 'Failed to delete blog',
          HttpStatusCode.INTERNAL_SERVER
        );
    }
  }

  // BlogRepository.ts
  async searchBlogs(query: string): Promise<{ blogs: IBlog[], totalCount: number }> {
    try {
      const searchRegex = new RegExp(query, 'i');

      // Search in title, brief, content and tags
      const blogs = await BlogModel.find({
        isPublished: true,
        $or: [
          { title: searchRegex },
          { brief: searchRegex },
          { content: searchRegex },
          { tags: { $in: [searchRegex] } }
        ]
      }).sort({ createdAt: -1 }).lean();

      const totalCount = blogs.length;

      const userIds = [...new Set(blogs.map(blog => blog.userId))];

      const users = await UserModel.find({ _id: { $in: userIds } })
        .select('username profilePicture profession')
        .lean();

      const userMap = new Map(users.map(user => [user._id.toString(), user]));

      const formattedBlogs = blogs.map(blog => {
        const user = userMap.get(blog.userId);
        return {
          ...blog,
          authorDetails: user ? {
            profilePicture: user.profilePicture,
            profession: user.profession
          } : null
        };
      });

      return {
        blogs: formattedBlogs,
        totalCount
      };
    } catch (error) {
      throw error instanceof CustomError
        ? error
        : new CustomError(
          error instanceof Error ? error.message : 'Failed to search blogs',
          HttpStatusCode.INTERNAL_SERVER
        );
    }
  }
}