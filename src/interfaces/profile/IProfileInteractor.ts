// IProfileInteractor.ts
import { IUserResponse } from "../../types/Auth";
import { PresignedUrlResponse } from "../../types/Profile"; 

export interface IProfileInteractor {
    updateProfile(userId: string, profileData: {
        username?: string;
        profession?: string;
        bio?: string;
        profilePicture?: string;
    }): Promise<IUserResponse>;
    
    getPresignedUrl(userId: string, fileType: string): Promise<PresignedUrlResponse>;
}