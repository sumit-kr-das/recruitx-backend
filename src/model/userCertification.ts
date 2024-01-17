import { Schema, model, Document } from "mongoose";
import { IUserCertificateModel } from "../@types/userCertificateTypes";


const UserCertificationSchema: Schema = new Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    source: { type: String, required: true },
    description: { type: String, required: true },
    // certificate:{type:String, required:true},
    startDate: { type: Date, required: true },
    endDate: { type: Date }
})

export default model<IUserCertificateModel>("UserCertification", UserCertificationSchema);