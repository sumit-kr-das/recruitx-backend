import { Schema, model, Document } from "mongoose";

export interface ICompany extends Document{
    name:string,
    description:string,
    email:string,
    password:string,
    logo:string,
    teamSize:number,
    type:string,
    ratings?:number,
}

const CompanySchema:Schema = new Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    logo:{type:String, required:true},
    teamSize:{type:Number, required:true},
    type:{type:String, required:true},
    rating:{type:Number, default:null}

})


export default <ICompany>("Company",CompanySchema);