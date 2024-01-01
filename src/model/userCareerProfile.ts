import { Schema, model, Document } from "mongoose";
import { IUserCareerModel } from "../@types/userCareerTypes";

const UserCareerProfileSchema: Schema = new Schema({
    userId: { type: String, required: true },
    industry: { type: String, required: true },
    role: { type: String, required: true },
    jobRole: { type: String, required: true },
    jobType: { type: String, required: true },
    employmentType: { type: String, required: true },
    // shift:{type:String, required:true},
    skills: { type: Array, required: true },
    expectedSalary: { type: Number }
})

export default model<IUserCareerModel>("UserCareerProfile", UserCareerProfileSchema);