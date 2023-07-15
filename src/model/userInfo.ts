import { Schema, model, Document } from "mongoose";

export interface IUserExprience extends Document{
    userId:string,
    phone:string,
    github:string,
    linkedIn?:string
}

const UserExprienceSchema:Schema = new Schema({
    userId:{type:String, required:true},
    phone:{type:String, required:true},
    github:{type:String, required:true},
    linkedIn:{type:String}
})

export default model<IUserExprience>("UserExprience", UserExprienceSchema);