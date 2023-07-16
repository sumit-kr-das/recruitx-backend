import { Schema, model, Document } from "mongoose";

export interface IUserCareerProfile extends Document{
    userId:string,
    industry:string,
    role:string,
    jobRole:string,
    jobType:string,
    employmentType:string,
    shift:string,
    location:[string],
    expectedSalary?:number
}

const UserCareerProfileSchema:Schema = new Schema({
    userId:{type:String, required:true},
    industry:{type:String, required:true},
    role:{type:String, required:true},
    jobRole:{type:String, required:true},
    jobType:{type:String, required:true},
    employmentType:{type:String, required:true},
    shift:{type:String, required:true},
    location:{type:Array, required:true},
    expectedSalary:{type:Number}
})

export default model<IUserCareerProfile>("UserCareerProfile", UserCareerProfileSchema);