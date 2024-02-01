import { Schema, model } from 'mongoose';
import roles from '../services/roleService';
import { ICompanyModel } from '../@types/companyTypes';
import companyStatus from '../services/conpanyStatusService';

const CompanySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        companyName: { type: String, required: true },
        industry: { type: String, required: true },
        designation: { type: String, required: true },
        pin: { type: String, required: true },
        address: { type: String, required: true },
        role: { type: String, default: roles.COMPANY },
        status: { type: String, default: companyStatus.UNVERIFIED },
        companyProfileId: { type: Schema.Types.ObjectId, ref: "CompanyProfile" }
    },
    {
        timestamps: true,
    },
);

export default model<ICompanyModel>('Company', CompanySchema);
