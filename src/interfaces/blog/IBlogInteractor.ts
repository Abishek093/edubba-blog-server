import { IBlog, IBlogCreate } from "../../entities/IBlog";
import { SearchBlogsParams, SearchBlogsResponse } from "../../types/Blog";

export interface IBlogInteractor{
    generatePresignedUrl(userId: string, fileType: string): Promise<{ uploadUrl: string; key: string }>;
    createBlog(blogData: IBlogCreate): Promise<IBlog> 
    getBlogById(blogId: string): Promise<IBlog> 
    getUserBlogs(userId: string): Promise<IBlog[]>
    getAllPublishedBlogs(): Promise<IBlog[]>
    updateBlog(blogId: string, updateData: Partial<IBlog>): Promise<IBlog>
    deleteBlog(blogId: string): Promise<boolean>
    searchBlogs(query: string): Promise<{blogs: IBlog[], totalCount: number}>;
}