import { ObjectId } from "mongoose"

export interface IOtp{
    email: string,
    otp: number,
    createdAt?: Date
}

export interface IOtpDoc extends IOtp{
    _id: ObjectId
    __v: number;
}