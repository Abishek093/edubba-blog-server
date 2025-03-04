import {Router} from 'express'
import { container } from 'tsyringe'
import { AuthController } from '../../adapters/controllers/AuthController'

const authRoutes = Router()
const authController = container.resolve(AuthController);


authRoutes.post('/signup', authController.signup.bind(authController))
authRoutes.post('/verify-otp', authController.verifyOtp.bind(authController))
authRoutes.post('/login', authController.login.bind(authController))
authRoutes.post('/resend-otp', authController.resendOtp.bind(authController))
authRoutes.get('/me', authController.getUser.bind(authController));
authRoutes.post('/refresh-token')
export default authRoutes