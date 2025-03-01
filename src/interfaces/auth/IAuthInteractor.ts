import { IUser } from "../../entities/IUser";
import { IUserResponse } from "../../types/Auth";

export interface IAuthInteractor{
    signup(user: IUser): Promise<void>
    login(email: string, password: string):Promise<IUserResponse>
    verifyOtp(otp: string, email: string): Promise<void>
    resendOtp(email: string):Promise<void>
}