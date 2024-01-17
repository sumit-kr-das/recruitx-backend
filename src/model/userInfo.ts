import { Schema, model } from 'mongoose';
import { IUserinfoModel } from '../@types/userInfoTypes';


const UserinfoSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    github: { type: String },
    linkedIn: { type: String },
    dateOfBirth: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    bio: {
        type: String,
        required: true,
        min: [15, 'Bio is shorter'],
        max: [30, 'Bio is too long'],
    },
    objective: { type: String, required: true },
    // status: { type: String, required: true },
    language: { type: Array, required: true },
    gender: { type: String, required: true },
    skills: { type: Array, required: true },
    photo: { type: String },
    maxQualification: { type: String, required: true },
});

export default model<IUserinfoModel>('Userinfo', UserinfoSchema);
