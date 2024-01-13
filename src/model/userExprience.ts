import { Schema, model } from 'mongoose';
import { IUserEducationModel } from '../@types/userEducationTypes';

const UserExprienceSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        skills: { type: Array, required: true },
        companyName: { type: String, required: true },
        designation: { type: String, required: true },
        experience: { type: Number, required: true },
        annualSalary: { type: Number },
        type: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        jobProfile: { type: String, require: true },
    },
    {
        timestamps: true,
    },
);

export default model<IUserEducationModel>('UserExprience', UserExprienceSchema);
