import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document{
    email:string,
    password:string,
    name:string,
    role:string
}

const AdminSchema:Schema = new Schema({
    email:{type:String, required:true},
    password:{type:String, required:true},
    name:{type:String, required:true},
    role:{type:String, required:true}
},{
    timestamps:true
});

export default model<IAdmin>("Admin", AdminSchema);