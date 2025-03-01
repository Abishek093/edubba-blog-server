import { IUser } from "../entities/IUser";


export type IUserResponse = {
    accessToken?: string;
    refreshToken?: string;
} & Omit<IUser, "password">;

export type UsernameTakenResponse = {
    isUsernameTaken: boolean;
};

export type AuthResponse = IUserResponse | UsernameTakenResponse;

export type ICreateUser = Omit<IUser, "_id">;
