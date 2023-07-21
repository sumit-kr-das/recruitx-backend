import { Schema, model, Document } from "mongoose";

export interface IUser extends Document{
    name:string,
    email:string,
    gender:string,
    password:string,
    skills:[string],
    photo?:string,
}

const UserSchema:Schema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    gender:{type:String, required:true},
    password:{type:String, required:true},
    skills:{type:Array, required:true},
    photo:{type:String, default:null}
})

export default model<IUser>("User",UserSchema);