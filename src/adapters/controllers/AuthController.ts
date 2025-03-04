import { injectable, inject } from "tsyringe";
import { IAuthInteractor } from "../../interfaces/auth/IAuthInteractor"
import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/customError";
import HttpStatusCode from "../../errors/httpStatusCodes";


@injectable()
export class AuthController {
    constructor(@inject('IAuthInteractor') private interactor: IAuthInteractor) { }

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userData } = req.body
            const newUser = await this.interactor.signup(userData)
            res.status(201).json({ email: newUser })
        } catch (error) {
            next(error)
        }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { otp, email } = req.body
            const verifyOtp = await this.interactor.verifyOtp(otp, email)
            res.status(200).json({ message: "Otp verified successfully please login to continue" })
        } catch (error) {
            next(error)
        }
    }

    async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body
            await this.interactor.resendOtp(email)
            res.status(201).json('Otp send successfully')
        } catch (error) {
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body
            const user = await this.interactor.login(email, password)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.headers.authorization?.split('Bearer ')[1];
            if (!token) {
                throw new CustomError('No token provided', HttpStatusCode.UNAUTHORIZED);
            }
            const user = await this.interactor.getUserByToken(token);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { refreshToken } = req.body;
        try {
          const { accessToken, newRefreshToken } = await this.interactor.refreshAccessToken(refreshToken);
          res.status(200).json({ accessToken, refreshToken: newRefreshToken })
        }  catch (error: any) {
          next(error)
        }
      };

}