import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IBlogInteractor } from "../../interfaces/blog/IBlogInteractor";
import { SearchBlogsParams, SearchBlogsResponse } from "../../types/Blog";

@injectable()
export class BlogController {
    constructor(@inject("IBlogInteractor") private interactor: IBlogInteractor) {}

    async createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, brief, content, tags, userId, author, imageUrl } = req.body;
            
            if (!userId) {
                res.status(400).json({ message: "UserId is required" });
                return;
            }

            const blog = await this.interactor.createBlog({
                title,
                brief,
                content,
                tags,
                userId,
                author,
                imageUrl
            });

            res.status(201).json({ message: "Blog created successfully", blog });
        } catch (error) {
            next(error);
        }
    }

    async generatePresignedUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, fileType } = req.body;
            if (!userId) {
                res.status(400).json({ message: "UserId is required" });
                return;
            }

            const result = await this.interactor.generatePresignedUrl(userId, fileType);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getUserBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            if (!userId) {
                res.status(400).json({ message: "UserId is required" });
                return;
            }

            const blogs = await this.interactor.getUserBlogs(userId);
            res.status(200).json(blogs);
        } catch (error) {
            next(error);
        }
    }

    async getAllPublishedBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const blogs = await this.interactor.getAllPublishedBlogs();
            res.status(200).json(blogs);
        } catch (error) {
            next(error);
        }
    }

    async getBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const blogId = req.params.blogId;
            if (!blogId) {
                res.status(400).json({ message: "Blog ID is required" });
                return;
            }

            const blog = await this.interactor.getBlogById(blogId);
            res.status(200).json(blog);
        } catch (error) {
            next(error);
        }
    }

    async updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const blogId = req.params.blogId;
            if (!blogId) {
                res.status(400).json({ message: "Blog ID is required" });
                return;
            }

            const updateData = req.body;
            const updatedBlog = await this.interactor.updateBlog(blogId, updateData);
            res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
        } catch (error) {
            next(error);
        }
    }

    async deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const blogId = req.params.blogId;
            if (!blogId) {
                res.status(400).json({ message: "Blog ID is required" });
                return;
            }

            await this.interactor.deleteBlog(blogId);
            res.status(200).json({ message: "Blog deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    async searchBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query.query as string;
            if (!query) {
                res.status(400).json({ message: "Search query is required" });
                return;
            }
    
            const results = await this.interactor.searchBlogs(query);
            res.status(200).json(results);
        } catch (error) {
            next(error);
        }
    }
}