import { injectable } from "tsyringe";
import { IAuthRepository } from "../../interfaces/auth/IAuthRepository";
import { IUser } from "../../entities/IUser";
import { UserModel } from "./models/UserModel";
import CustomError from "../../errors/customError";
import { MongoError } from "mongodb";
import HttpStatusCode from "../../errors/httpStatusCodes";
import { IOtp, IOtpDoc } from "../../entities/IOtp";
import otpModel from "./models/OtpModel";
import { ICreateUser, IUserResponse } from "../../types/Auth";

@injectable()
export class AuthRepository implements IAuthRepository {

    async getUserByUsername(username: string): Promise<string | null> {
        try {
            const existingUsername = await UserModel.findOne({ username: username })
            if (existingUsername) {
                return existingUsername.username
            }
            return null

        } catch (error) {
            throw new CustomError(error, HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async getUserByMail(email: string): Promise<IUser | null> {
        try {
            const existingUser = await UserModel.findOne({ email });
            if (!existingUser) return null;
            return existingUser.toObject();
        } catch (error) {
            throw new CustomError(error, HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async createUser(user: ICreateUser): Promise<IUserResponse> {
        try {
            const userDoc = new UserModel(user);
            const savedUser = await userDoc.save();

            return savedUser
        } catch (error) {
            if (error instanceof MongoError && error.code === 11000) {
                throw new CustomError("User with this email already exists", HttpStatusCode.CONFLICT, { field: "email" });
            }
            throw new CustomError(error, HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async saveOtp(otpData: IOtp): Promise<IOtp> {
        try {
            const otpDoc = new otpModel(otpData)
            return await otpDoc.save()
        } catch (error) {
            throw new CustomError(error, HttpStatusCode.INTERNAL_SERVER)
        }
    }

    async getOtp(email: string): Promise<IOtpDoc | null> {
        try {
            const result = await otpModel.findOne({ email: email })
                .sort({ createdAt: -1 })
                .lean();

            return result as IOtpDoc | null;
        } catch (error) {
            throw new CustomError(
                error instanceof Error ? error.message : "Unknown error",
                HttpStatusCode.INTERNAL_SERVER
            );
        }
    }

    async verifyUser(email: string): Promise<void> {
        try {
            const user = await UserModel.findOne({ email: email })
            if (!user) throw new CustomError("User not found", HttpStatusCode.NOT_FOUND)
            user.isVerified = true
            user.save()
        } catch (error) {
            throw new CustomError(error, HttpStatusCode.INTERNAL_SERVER)
        }
    }

    async updateUser(user: IUser): Promise<void> {
        try {
            await UserModel.updateOne({ email: user.email }, user);
        } catch (error) {
            throw new CustomError(error, HttpStatusCode.INTERNAL_SERVER);
        }
    }

    async getUserById(id: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findById(id);
            if (!user) return null;
            return user.toObject();
        } catch (error) {
            throw new CustomError(
                error instanceof Error ? error.message : 'Unknown error',
                HttpStatusCode.INTERNAL_SERVER
            );
        }
    }
}