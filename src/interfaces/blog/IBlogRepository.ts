import { IBlog, IBlogCreate } from "../../entities/IBlog";
import { SearchBlogsParams, SearchBlogsResponse } from "../../types/Blog";

export interface IBlogRepository{
    createBlog(blogData: IBlogCreate): Promise<IBlog>
    getBlogById(blogId: string): Promise<IBlog | null>
    getUserBlogs(userId: string): Promise<IBlog[]>
    getAllPublishedBlogs(): Promise<IBlog[]>
    updateBlog(blogId: string, updateData: Partial<IBlog>): Promise<IBlog | null>
    deleteBlog(blogId: string): Promise<boolean> 
    searchBlogs(query: string): Promise<{blogs: IBlog[], totalCount: number}>;
}