import { Schema, model } from 'mongoose';
import { IUserEducationModel } from '../@types/userEducationTypes';

const UserEducationDetailSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        degree: { type: String, required: true },
        college: { type: String, required: true },
        course: { type: String, required: true },
        courseType: { type: String, required: true },
        admissionYear: { type: Number, required: true },
        passYear: { type: Number, required: true },
        marks: { type: Number, required: true },
    },
    {
        timestamps: true,
    },
);

export default model<IUserEducationModel>(
    'UserEducationDetail',
    UserEducationDetailSchema,
);
