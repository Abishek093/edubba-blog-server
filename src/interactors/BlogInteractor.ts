import { inject, injectable } from "tsyringe";
import { IBlogInteractor } from "../interfaces/blog/IBlogInteractor";
import { IBlogRepository } from "../interfaces/blog/IBlogRepository";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import CustomError from "../errors/customError";
import HttpStatusCode from "../errors/httpStatusCodes";
import { IBlog, IBlogCreate } from "../entities/IBlog";
import { SearchBlogsParams, SearchBlogsResponse } from "../types/Blog";

@injectable()
export class BlogInteractor implements IBlogInteractor {
  constructor(
    @inject("IBlogRepository") private repository: IBlogRepository
  ) {}

  async createBlog(blogData: IBlogCreate): Promise<IBlog> {
    try {
      if (!blogData.title || !blogData.content || !blogData.userId || !blogData.author) {
        throw new CustomError(
          "Missing required fields for blog creation",
          HttpStatusCode.BAD_REQUEST
        );
      }

      return await this.repository.createBlog(blogData);
    } catch (error) {
      throw error instanceof CustomError
        ? error
        : new CustomError(
            error instanceof Error ? error.message : 'Failed to create blog',
            HttpStatusCode.INTERNAL_SERVER
          );
    }
  }

  async getBlogById(blogId: string): Promise<IBlog> {
    try {
      const blog = await this.repository.getBlogById(blogId);
      if (!blog) {
        throw new CustomError(
          "Blog not found",
          HttpStatusCode.NOT_FOUND
        );
      }
      return blog;
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
      return await this.repository.getUserBlogs(userId);
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
      return await this.repository.getAllPublishedBlogs();
    } catch (error) {
      throw error instanceof CustomError
        ? error
        : new CustomError(
            error instanceof Error ? error.message : 'Failed to get published blogs',
            HttpStatusCode.INTERNAL_SERVER
          );
    }
  }

  async updateBlog(blogId: string, updateData: Partial<IBlog>): Promise<IBlog> {
    try {
      const updatedBlog = await this.repository.updateBlog(blogId, updateData);
      if (!updatedBlog) {
        throw new CustomError(
          "Blog not found",
          HttpStatusCode.NOT_FOUND
        );
      }
      return updatedBlog;
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
      const result = await this.repository.deleteBlog(blogId);
      if (!result) {
        throw new CustomError(
          "Blog not found or could not be deleted",
          HttpStatusCode.NOT_FOUND
        );
      }
      return result;
    } catch (error) {
      throw error instanceof CustomError
        ? error
        : new CustomError(
            error instanceof Error ? error.message : 'Failed to delete blog',
            HttpStatusCode.INTERNAL_SERVER
          );
    }
  }

  async generatePresignedUrl(userId: string, fileType: string): Promise<{ uploadUrl: string; key: string }> {
    try {
      const region = process.env.AWS_REGION!;
      const bucket = process.env.AWS_BUCKET_NAME!;
      const s3Client = new S3Client({ region });
  
      // Generate a unique key for the image
      const timestamp = new Date().getTime();
      const key = `blogs/${userId}-${timestamp}.${fileType}`;
  
      const params = {
        Bucket: bucket,
        Key: key,
        ContentType: `image/${fileType}`,
      };
  
      const command = new PutObjectCommand(params);
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
  
      return { uploadUrl: signedUrl, key };
    } catch (error) {
      throw error instanceof CustomError
        ? error
        : new CustomError(
            error instanceof Error ? error.message : 'Unknown error',
            HttpStatusCode.INTERNAL_SERVER
          );
    }
  }

  async searchBlogs(query: string): Promise<{blogs: IBlog[], totalCount: number}> {
    try {
        if (!query.trim()) {
            throw new CustomError(
                "Search query cannot be empty",
                HttpStatusCode.BAD_REQUEST
            );
        }
        
        return await this.repository.searchBlogs(query);
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