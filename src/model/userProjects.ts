import { Schema, model, Document } from "mongoose";

export interface IUserProject extends Document{
    userId:string,
    name:string,
    description:string,
    skills:[string],
    startDate:Date,
    endDate?:Date,
}

const UserProjectSchema:Schema = new Schema({
    userId:{type:String, required:true},
    name:{type:String, required:true},
    description:{type:String, required:true},
    skills:{type:Array, required:true},
    startDate:{type:Date, required:true},
    endDate:{type:Date}
});

export default model<IUserProject>("UserProject",UserProjectSchema);