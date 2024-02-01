import { Schema, model } from 'mongoose';
import { ICompanyProfileModel } from '../@types/companyProfileTypes';



const CompanyProfileSchema: Schema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    logo: { type: String },
    description: { type: String, required: true },
    teamSize: { type: Number, required: true },
    type: { type: String, required: true },
    tags: { type: Array, required: true },
    founded: { type: String, required: true },
});

export default model<ICompanyProfileModel>('CompanyProfile', CompanyProfileSchema);
