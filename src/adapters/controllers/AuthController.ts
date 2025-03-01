import { injectable, inject } from "tsyringe";
import { IAuthInteractor } from "../../interfaces/auth/IAuthInteractor"
import { NextFunction, Request, Response } from "express";


@injectable()
export class AuthController {
    constructor(@inject('IAuthInteractor') private interactor: IAuthInteractor) { }

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userData } = req.body
            const newUser = await this.interactor.signup(userData)
            res.status(201).json("Verify otp to continue")
        } catch (error) {
            next(error)
        }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { otp, email } = req.body
            const verifyOtp = await this.interactor.verifyOtp(otp, email)
            res.status(200).json("Otp verified successfully")
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


}