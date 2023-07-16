import { Schema, model, Document } from "mongoose";

export interface ICompany extends Document{
    name:string,
    description:string,
    email:string,
    password:string,
    logo:string,
    teamSize:string,
    type:string,
    ratings?:number,
}

const CompanySchema:Schema = new Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    
})