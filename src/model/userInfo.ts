import { Schema, model, Document } from "mongoose";

export interface IUserExprience extends Document{
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
    language:[string]

}

const UserExprienceSchema:Schema = new Schema({
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
    language:{type:Array, required:true}
})

export default model<IUserExprience>("UserExprience", UserExprienceSchema);