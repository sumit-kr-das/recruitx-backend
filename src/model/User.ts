import { Schema, model, Document } from "mongoose";
import roles from "../services/roleService";
export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    role:string
}

const UserSchema:Schema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{type:String, default:roles.USER}
})

export default model<IUser>("User",UserSchema);