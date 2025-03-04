import {Router} from 'express'
import authRoutes from './auth.router'
import blogRoutes from './blog.routes'
import profileRoutes from './ProfileRoutes'


const router = Router()

router.use('/auth', authRoutes)
router.use('/blogs',blogRoutes)
router.use('/profile', profileRoutes);

export default router