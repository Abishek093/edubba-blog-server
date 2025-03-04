// ProfileInteractor.ts
import { injectable, inject } from "tsyringe";
import { IProfileInteractor } from "../interfaces/profile/IProfileInteractor";
import { IProfileRepository } from "../interfaces/profile/IProfileRepository";
import { IAuthRepository } from "../interfaces/auth/IAuthRepository"; 
import { IUserResponse } from "../types/Auth";
import CustomError from "../errors/customError";
import HttpStatusCode from "../errors/httpStatusCodes";
import { PresignedUrlResponse } from "../types/Profile";
import { generatePresignedUrl } from "../utils/s3Helper"; 

@injectable()
export class ProfileInteractor implements IProfileInteractor {
    constructor(
        @inject('IProfileRepository') private repository: IProfileRepository,
        @inject('IAuthRepository') private authRepository: IAuthRepository
    ) {}

    async updateProfile(userId: string, profileData: {
        username?: string;
        profession?: string;
        bio?: string;
        profilePicture?: string;
    }): Promise<IUserResponse> {
        try {
            // Validate username uniqueness if changed
            if (profileData.username) {
                const currentUser = await this.repository.getUserById(userId);
                if (!currentUser) {
                    throw new CustomError("User not found", HttpStatusCode.NOT_FOUND);
                }
                
                if (currentUser.username !== profileData.username) {
                    const existingUser = await this.repository.getUserByUsername(profileData.username);
                    if (existingUser) {
                        throw new CustomError("Username already exists", HttpStatusCode.CONFLICT, { field: 'username' });
                    }
                }
            }
            
            // Update user profile
            const updatedUser = await this.repository.updateUserProfile(userId, profileData);
            if (!updatedUser) {
                throw new CustomError("Failed to update profile", HttpStatusCode.INTERNAL_SERVER);
            }
            
            // Remove password from response
            const { password: _, ...userResponse } = updatedUser;
            return userResponse as IUserResponse;
            
        } catch (error) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                    error instanceof Error ? error.message : "Unknown error",
                    HttpStatusCode.INTERNAL_SERVER
                );
        }
    }
    
    async getPresignedUrl(userId: string, fileType: string): Promise<PresignedUrlResponse> {
        try {
            // Validate user exists
            const user = await this.repository.getUserById(userId);
            if (!user) {
                throw new CustomError("User not found", HttpStatusCode.NOT_FOUND);
            }
            
            // Check if fileType is valid (should be an image)
            if (!fileType.startsWith('image/')) {
                throw new CustomError("Invalid file type", HttpStatusCode.BAD_REQUEST);
            }
            
            // Generate a unique key for the file
            const key = `profiles/${userId}/${Date.now()}.${fileType.split('/')[1]}`;
            
            // Generate a presigned URL for S3 upload
            const uploadUrl = await generatePresignedUrl(key, fileType);
            
            return { uploadUrl, key };
            
        } catch (error) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                    error instanceof Error ? error.message : "Unknown error",
                    HttpStatusCode.INTERNAL_SERVER
                );
        }
    }
}