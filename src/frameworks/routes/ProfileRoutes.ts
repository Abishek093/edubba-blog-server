import { Router } from 'express';
import { container } from 'tsyringe';
import { ProfileController } from '../../adapters/controllers/ProfileController'; 
import authMiddleware from '../../middleware/ authMiddleware';

const profileRoutes = Router();
const profileController = container.resolve(ProfileController);

profileRoutes.patch('/update', authMiddleware, profileController.updateProfile.bind(profileController));
// profileRoutes.post('/upload-url', authMiddleware, profileController.getPresignedUrl.bind(profileController));

export default profileRoutes;