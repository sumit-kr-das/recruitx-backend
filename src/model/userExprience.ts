import { Schema, model, Document } from 'mongoose';

export interface IUserExprience extends Document {
    userId: string;
    skills: [string];
    companyName: string;
    designation: string,
    experience: string,
    annualSalary?: string,
    type: string,
    startDate: Date;
    endDate?: Date;
    jobProfile: string;
}

const UserExprienceSchema: Schema = new Schema(
    {
        userId: { type: String, required: true },
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

export default model<IUserExprience>('UserExprience', UserExprienceSchema);
