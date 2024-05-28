import { Schema, model } from "mongoose";
import { IAdminModel, IAdminRequestBody } from "../@types/adminTypes";

const AdminSchema: Schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, default: "approved" }
}, {
    timestamps: true
});

export default model<IAdminModel>("Admin", AdminSchema);