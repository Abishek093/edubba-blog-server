import { Schema, model } from "mongoose";
import { IUser } from "../../../entities/IUser";


const userSchema = new Schema<IUser>({
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    username:{type: String, required: true, unique: true},
    profilePicture:{type: String, required: false},
    profession:{type: String, required: false},
    bio:{type: String, required: false},
    isVerified: {type: Boolean, required: true, default: false},
    isBlocked: {type: Boolean, default: false},
    isGoogleUser: {type: Boolean, default: false}
})

export const UserModel = model<IUser>('User', userSchema)