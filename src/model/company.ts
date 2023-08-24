import { Schema, model, Document } from "mongoose";

export interface ICompany extends Document{
    description:string,
    logo:string,
    teamSize:number,
    type:string,
    rating?:number,
}

const CompanySchema:Schema = new Schema({
    description:{type:String, required:true},
    logo:{type:String, required:true},
    teamSize:{type:Number, required:true},
    type:{type:String, required:true},
    rating:{type:Number, default:0}

})

export default model<ICompany>("Company",CompanySchema);