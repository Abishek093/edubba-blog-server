import { ObjectId } from "mongoose";

export interface IUser {
    email: string,
    password: string,
    username: string,
    profilePicture?: string,
    profession?: string,
    bio?: string,
    isVerified?: boolean,
    isBlocked?: boolean
    _id: ObjectId
    isGoogleUser: boolean
}

 