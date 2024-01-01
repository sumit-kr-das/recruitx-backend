import { Schema, model, Document } from "mongoose";
import { IUserProjectModel } from "../@types/userProjectTypes";


const UserProjectSchema: Schema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: Array, required: true },
    startDate: { type: Date, required: true },
    associate: { type: String, required: true },
    endDate: { type: Date }
});

export default model<IUserProjectModel>("UserProject", UserProjectSchema);