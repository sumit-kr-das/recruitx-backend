import { Schema, model, Document } from 'mongoose';

export interface ICompanyProfile extends Document {
    companyId:string,
    description: string;
    logo: string;
    teamSize: number;
    type: string;
    rating?: number;
}

const CompanyProfileSchema: Schema = new Schema({
    companyId:{type:String, required:true},
    description: { type: String, required: true },
    logo: { type: String, required: true },
    teamSize: { type: Number, required: true },
    type: { type: String, required: true },
    rating: { type: Number, default: 0 },
});

export default model<ICompanyProfile>('CompanyProfile', CompanyProfileSchema);
