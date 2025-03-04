// ProfileRepository.ts
import { injectable } from "tsyringe";
import { IProfileRepository } from "../../interfaces/profile/IProfileRepository";
import { IUser } from "../../entities/IUser";
import { UserModel } from "./models/UserModel";
import CustomError from "../../errors/customError";
import HttpStatusCode from "../../errors/httpStatusCodes";
import { ObjectId } from "mongoose";

@injectable()
export class ProfileRepository implements IProfileRepository {
    async updateUserProfile(userId: string, profileData: {
        username?: string;
        profession?: string;
        bio?: string;
        profilePicture?: string;
    }): Promise<IUser> {
        try {
            const user = await UserModel.findByIdAndUpdate(
                userId,
                { $set: profileData },
                { new: true }
            );
            
            if (!user) {
                throw new CustomError("User not found", HttpStatusCode.NOT_FOUND);
            }
            
            return user.toObject();
        } catch (error) {
            throw new CustomError(
                error instanceof Error ? error.message : "Unknown error",
                HttpStatusCode.INTERNAL_SERVER
            );
        }
    }
    
    async getUserById(userId: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findById(userId);
            if (!user) return null;
            return user.toObject();
        } catch (error) {
            throw new CustomError(
                error instanceof Error ? error.message : "Unknown error",
                HttpStatusCode.INTERNAL_SERVER
            );
        }
    }
    
    async getUserByUsername(username: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findOne({ username });
            if (!user) return null;
            return user.toObject();
        } catch (error) {
            throw new CustomError(
                error instanceof Error ? error.message : "Unknown error",
                HttpStatusCode.INTERNAL_SERVER
            );
        }
    }
}