import { Schema, model, Document } from 'mongoose';

export interface ICompanyProfile extends Document {
    companyId:string,
    description: string;
    logo: string;
    teamSize: number;
    type: string; // private
    tags: string;
    founded: string;
}

const CompanyProfileSchema: Schema = new Schema({
    companyId:{type:String, required:true},
    logo: { type: String },
    description: { type: String, required: true },
    teamSize: { type: Number, required: true },
    type: { type: String, required: true },
    tags: {type: Array, required: true},
    founded: { type: String, required: true },
});

export default model<ICompanyProfile>('CompanyProfile', CompanyProfileSchema);
