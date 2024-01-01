import { Schema, model, Document } from "mongoose";
import { IRatingModel } from "../@types/ratingTypes";

const ratingSchema: Schema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true }
}, {
    timestamps: true
});

export default model<IRatingModel>('Rating', ratingSchema);