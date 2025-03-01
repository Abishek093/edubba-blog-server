import mongoose, { Schema } from "mongoose";
import { IOtp } from "../../../entities/IOtp";


const otpSchma = new Schema<IOtp>({
    email: {type: String, required: true},
    otp: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now, expires: 120 }
})

const otpModel = mongoose.model<IOtp>('Otp', otpSchma)

export default otpModel