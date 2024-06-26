import { Schema, model } from "mongoose";
import { IUserProjectModel } from "../@types/userProjectTypes";


const UserProjectSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: Array, required: true },
    startDate: { type: Date, required: true },
    associate: { type: String, required: true },
    endDate: { type: Date }
});

export default model<IUserProjectModel>("UserProject", UserProjectSchema);