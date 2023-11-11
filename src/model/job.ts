import { Schema, model, Document } from "mongoose";
import company from "./company";

export interface IJob extends Document{
    title:string,
    category:string,
    description:string,
    tags:[string],
    active:boolean,
    companyId:string,
    info:{
        vacancies:number,
        education:string,
        type:string,
        startDate:Date,
        endDate:Date,
        roles:string,
        skills:[string],
        minExprience:number,
        maxExprience?:number,
        minSalary?:number,
        maxSalary?:number
    },
}

const JobSchema:Schema = new Schema({
    title:{type:String, required:true},
    category:{type:String, required:true},
    description:{type:String, required:true},
    tags:{type:Array, required:true},
    active:{type:Boolean, required:true},
    companyId:{type:Schema.Types.ObjectId, ref:"Company", required:true},
    info:{
        vacancies:{type:Number, required:true},
        education:{type:String, required:true},
        type:{type:String, required:true},
        startDate:{type:Date, required:true},
        endDate:{type:Date, required:true},
        roles:{type:String, required:true},
        skills:{type:Array, required:true},
        minExprience:{type:Number, required:true},
        maxExprience:{type:Number},
        minSalary:{type:Number},
        maxSalary:{type:Number}
    },
},{
    timestamps:true
});

export default model<IJob>("Job",JobSchema);