import { IOtp, IOtpDoc } from "../../entities/IOtp";
import { IUser } from "../../entities/IUser";
import { ICreateUser, IUserResponse } from "../../types/Auth";

export interface IAuthRepository{
    getUserByMail(email: string): Promise<IUser | null> 
    createUser(user: ICreateUser): Promise<IUserResponse>
    getUserByUsername(username: string):Promise<string | null>
    saveOtp(otpData: IOtp):Promise<IOtp>
    getOtp(otp: string, email: string): Promise<IOtpDoc | null>
    verifyUser(email: string):Promise<void>
    updateUser(user: IUser): Promise<void>
}