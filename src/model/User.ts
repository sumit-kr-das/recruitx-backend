import { Schema, model, Document } from 'mongoose';
import roles from '../services/roleService';
import { IUserModel } from '../@types/usertypes';

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phoneNo: { type: String, required: true },
        workStatus: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, default: roles.USER },
        approve: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    },
);

export default model<IUserModel>('User', UserSchema);
