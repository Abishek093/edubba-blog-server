import {Router} from 'express'
import authRoutes from './auth.router'
import blogRoutes from './blog.routes'


const router = Router()

router.use('/auth', authRoutes)
router.use('/blog',blogRoutes)

export default router