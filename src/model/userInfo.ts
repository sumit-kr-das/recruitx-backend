import { Schema, model, Document } from "mongoose";

export interface IUserinfo extends Document{
    userId:string,
    phone:string,
    github:string,
    linkedIn?:string,
    dateOfBirth:Date,
    age:number,
    address:string,
    bio:string,
    objective:string,
    status:string,
    language:[string],
    gender:string,
    skills:[string],
    photo:string,
    maxQualification: string

}

const UserinfoSchema:Schema = new Schema({
    userId:{type:String, required:true},
    phone:{type:String, required:true},
    github:{type:String, required:true},
    linkedIn:{type:String},
    dateOfBirth:{type:Date, required:true},
    age:{type:Number, required:true},
    address:{type:String, required:true},
    bio:{type:String, required:true,   min: [15, 'Bio is shorter'], max:[30, 'Bio is too long']},
    objective:{type:String, required:true},
    status:{type:String, required:true},
    language:{type:Array, required:true},
    gender:{type:String, required:true},
    skills:{type:Array, required:true},
    photo:{type:String, required:true},
    maxQualification:{type:String, required:true}
})

export default model<IUserinfo>("Userinfo", UserinfoSchema);