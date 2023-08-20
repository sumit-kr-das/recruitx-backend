import { Schema, model, Document } from "mongoose";

export interface IApplier extends Document{
    jobId:string,
    userId:string,
    selected:boolean
}

const ApplierSchema:Schema = new Schema({
    jobId:{type:String, required:true},
    userId:{type:String, required:true},
    selected:{type:Boolean, required:true}
},{
    timestamps:true
})

export default model<IApplier>("Applier",ApplierSchema);

