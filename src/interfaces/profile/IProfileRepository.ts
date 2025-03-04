// IProfileRepository.ts
import { IUser } from "../../entities/IUser";
import { IUserResponse } from "../../types/Auth";

export interface IProfileRepository {
    updateUserProfile(userId: string, profileData: {
        username?: string;
        profession?: string;
        bio?: string;
        profilePicture?: string;
    }): Promise<IUser>;
    
    getUserById(userId: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;
}