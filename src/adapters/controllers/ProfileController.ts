import { injectable, inject } from "tsyringe";
import { IProfileInteractor } from "../../interfaces/profile/IProfileInteractor"; 
import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/customError";
import HttpStatusCode from "../../errors/httpStatusCodes";

@injectable()
export class ProfileController {
    constructor(@inject('IProfileInteractor') private interactor: IProfileInteractor) { }

    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id; 
            if (!userId) {
                throw new CustomError('User not authenticated', HttpStatusCode.UNAUTHORIZED);
            }
            
            const profileData = req.body;
            const updatedUser = await this.interactor.updateProfile(userId, profileData);
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async getPresignedUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, fileType } = req.body;
            const presignedUrlData = await this.interactor.getPresignedUrl(userId, fileType);
            res.status(200).json(presignedUrlData);
        } catch (error) {
            next(error);
        }
    }
}