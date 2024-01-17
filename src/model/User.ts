import { Schema, model } from 'mongoose';
import roles from '../services/roleService';
import { IUserModel } from '../@types/usertypes';
import userStatus from '../services/userStatusService';

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phoneNo: { type: String, required: true },
        workStatus: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, default: roles.USER },
        status: { type: String, default: userStatus.UNVERIFIED },
    },
    {
        timestamps: true,
    },
);

export default model<IUserModel>('User', UserSchema);
