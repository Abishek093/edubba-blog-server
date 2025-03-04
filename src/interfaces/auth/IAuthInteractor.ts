import { IUser } from "../../entities/IUser";
import { IUserResponse } from "../../types/Auth";

export interface IAuthInteractor{
    signup(user: IUser): Promise<string>
    login(email: string, password: string):Promise<IUserResponse>
    verifyOtp(otp: string, email: string): Promise<void>
    resendOtp(email: string):Promise<void>
    getUserByToken(token: string): Promise<IUserResponse>;
    refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; newRefreshToken: string }>

}