import { Schema, model, Document } from "mongoose";

export interface IApplier extends Document {
    jobId: string,
    userId: string,
    selected: boolean
}

const ApplierSchema: Schema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job', required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    selected: { type: Boolean, required: true }
}, {
    timestamps: true
})

export default model<IApplier>("Applier", ApplierSchema);

