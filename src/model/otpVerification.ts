import { Schema, model } from 'mongoose';
import { IUserOtpVerification } from '../@types/userOtpVerificationTypes';

const UserSchema: Schema = new Schema({
    userId: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
});

export default model<IUserOtpVerification>('OtpVerification', UserSchema);
