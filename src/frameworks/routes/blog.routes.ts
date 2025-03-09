import { Router } from "express";
import { BlogController } from "../../adapters/controllers/BlogController";
import { container } from "tsyringe";
import authenticate from '../../middleware/ authMiddleware';

const blogRoutes = Router();
const blogController = container.resolve(BlogController);

blogRoutes.post('/create-blog',authenticate, blogController.createBlog.bind(blogController));
blogRoutes.get('/get-blogs', blogController.getAllPublishedBlogs.bind(blogController));
blogRoutes.get('/user-blogs/:userId',authenticate, blogController.getUserBlogs.bind(blogController));

blogRoutes.get('/search', blogController.searchBlogs.bind(blogController)); 

blogRoutes.post('/upload-url',authenticate, blogController.generatePresignedUrl.bind(blogController));
blogRoutes.get('/:blogId', blogController.getBlogById.bind(blogController));
blogRoutes.put('/:blogId',authenticate, blogController.updateBlog.bind(blogController));
blogRoutes.delete('/:blogId',authenticate, blogController.deleteBlog.bind(blogController));
export default blogRoutes;