import { injectable, inject } from "tsyringe";
import { IAuthInteractor } from "../interfaces/auth/IAuthInteractor";
import { IAuthRepository } from "../interfaces/auth/IAuthRepository";
import { IUser } from "../entities/IUser";
import CustomError from "../errors/customError";
import HttpStatusCode from "../errors/httpStatusCodes";
import { MongoError } from "mongodb";
import * as bcrypt from 'bcrypt';
import { userSchema } from '../validation/schemas/userSchema'
import { generateOtp } from "../utils/OtpGenerator";
import { generateOtpEmailContent } from "../utils/MailContent";
import sendMail from "../helper/mailer";
import { generateToken } from "../helper/jwt";
import { AuthResponse, ICreateUser, IUserResponse } from "../types/Auth";
import crypto from 'crypto';

@injectable()
export class AuthInteractor implements IAuthInteractor {
   constructor(@inject('IAuthRepository') private repository: IAuthRepository) { }

   async signup(user: IUser): Promise<void> {
      try {
         const validationResult = userSchema.validate(user, { abortEarly: false });
         if (validationResult.error) {
            const errors = validationResult.error.details.map(detail => ({
               message: detail.message,
               field: detail.path.join('.')
            }));
            throw new CustomError("Validation failed", HttpStatusCode.BAD_REQUEST, { errors });
         }

         const existingUser = await this.repository.getUserByMail(user.email);
         if (existingUser && existingUser.isVerified && !existingUser.isBlocked) {
            throw new CustomError("User already exists, please sign in to continue", HttpStatusCode.CONFLICT);
         }

         if (existingUser && !existingUser.isVerified) {
            if (existingUser.username !== user.username) {
               const existingUsername = await this.repository.getUserByUsername(user.username);
               if (existingUsername) {
                  throw new CustomError("Username already exists", HttpStatusCode.CONFLICT, { field: 'username' });
               }
            }
            const hashedPassword = await bcrypt.hash(user.password, 10);
            existingUser.password = hashedPassword;
            existingUser.username = user.username;
            await this.repository.updateUser(existingUser);
            this.dispatchOtp(existingUser.username, existingUser.email);
            return;
         }

         const existingUsername = await this.repository.getUserByUsername(user.username);
         if (existingUsername) {
            throw new CustomError("Username already exists", HttpStatusCode.CONFLICT, { field: 'username' });
         }

         if (existingUser && !existingUser.isVerified) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            existingUser.password = hashedPassword;
            await this.repository.updateUser(existingUser);
            this.dispatchOtp(existingUser.username, existingUser.email);
            return;
         }

         const hashedPassword = await bcrypt.hash(user.password, 10);
         const userToCreate = { ...user, password: hashedPassword };
         const newUser = await this.repository.createUser(userToCreate);
         if (!newUser) throw new CustomError("Failed to create user", HttpStatusCode.INTERNAL_SERVER);
         await this.dispatchOtp(newUser.username, newUser.email);
         return
      } catch (error) {
         if (error instanceof MongoError && error.code === 11000) {
            throw new CustomError("User with this email already exists", HttpStatusCode.CONFLICT, { field: "email" });
         }
         throw error instanceof CustomError
            ? error
            : new CustomError(
               error instanceof Error ? error.message : "Unknown error",
               HttpStatusCode.INTERNAL_SERVER
            );
      }
   }

   async dispatchOtp(username: string, email: string): Promise<void> {
      try {
         const otp = generateOtp()
         console.log("OTP: ", otp)
         const savedOtp = await this.repository.saveOtp({ email: email, otp: otp })
         if (!savedOtp) throw new CustomError("Faied to save otp", HttpStatusCode.INTERNAL_SERVER)
         const emailContent = generateOtpEmailContent(username, otp)
         sendMail(email, emailContent)

      } catch (error) {
         throw error instanceof CustomError
            ? error
            : new CustomError(
               error instanceof Error ? error.message : "Unknown error",
               HttpStatusCode.INTERNAL_SERVER
            );
      }
   }

   async resendOtp(email: string): Promise<void> {
      try {
         const user = await this.repository.getUserByMail(email)
         if (!user) {
            throw new CustomError('User not found', HttpStatusCode.NOT_FOUND)
         }
         this.dispatchOtp(user.username, user.email)
      } catch (error) {
         throw error instanceof CustomError
            ? error
            : new CustomError(
               error instanceof Error ? error.message : "Unknown error",
               HttpStatusCode.INTERNAL_SERVER
            );
      }
   }

   async verifyOtp(otp: string, email: string): Promise<void> {
      if (!otp || !email) throw new CustomError("Plese provide otp", HttpStatusCode.BAD_REQUEST)
      try {
         const validOtp = await this.repository.getOtp(otp, email)
         if (!validOtp) throw new CustomError("OTP expired ", HttpStatusCode.NOT_FOUND)
         await this.repository.verifyUser(email)
      } catch (error) {
         throw error instanceof CustomError
            ? error
            : new CustomError(
               error instanceof Error ? error.message : "Unknown error",
               HttpStatusCode.INTERNAL_SERVER
            );
      }
   }


   async login(email: string, password: string): Promise<IUserResponse> {

      if (!email || !password) {
         throw new CustomError('Missing credentials', HttpStatusCode.BAD_REQUEST)
      }
      try {
         const user = await this.repository.getUserByMail(email)
         if (user) {
            if (await bcrypt.compare(password, user.password)) {
               const { password: _password, ...userResponse } = user;
               const { accessToken, refreshToken } = generateToken(user._id.toString())
               return { accessToken, refreshToken, ...userResponse } as IUserResponse;
            }
            throw new CustomError('Pasword incorrect', HttpStatusCode.UNAUTHORIZED, { field: "password" })
         }
         throw new CustomError('User not found', HttpStatusCode.NOT_FOUND, { field: "password" })
      } catch (error) {
         throw error instanceof CustomError
            ? error
            : new CustomError(
               error instanceof Error ? error.message : "Unknown error",
               HttpStatusCode.INTERNAL_SERVER
            );
      }
   }

   async googleAuth(username: string, email: string, profileImage: string): Promise<AuthResponse> {
      try {
         const existingUser = await this.repository.getUserByMail(email)
         if (existingUser) {
            if (existingUser.isBlocked) {
               throw new CustomError("Account is temporarily blocked!", HttpStatusCode.FORBIDDEN);
            }
            if (!existingUser.isGoogleUser) {
               throw new CustomError('Please login using your email and password.', HttpStatusCode.BAD_REQUEST);
            }
            const { password: _password, ...userData } = existingUser;

            const { accessToken, refreshToken } = generateToken(existingUser._id.toString());
            return { accessToken, refreshToken, ...existingUser } as IUserResponse;
         }

         const existingUsername = await this.repository.getUserByUsername(username);
         if (existingUsername) {
            return { isUsernameTaken: true };
         }

         const randomPassword = crypto.randomBytes(16).toString('hex');
         const hashedPassword = await bcrypt.hash(randomPassword, 10);

         const user: ICreateUser = {
            username: username,
            email: email,
            password: hashedPassword,
            profilePicture: profileImage,
            isGoogleUser: true,
         }

         const newUser = await this.repository.createUser(user)
         const { accessToken, refreshToken } = generateToken(newUser._id.toString());
         return { accessToken, refreshToken, ...newUser } as IUserResponse
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