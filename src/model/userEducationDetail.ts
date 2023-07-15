import { Schema, model, Document } from "mongoose";

export interface IUserEducationDetail extends Document{
    userId:string,
    degree:string,
    college:string,
    duration:{
        admissionYear:number,
        passYear:number
    },
    marks:number
}

const UserEducationDetailSchema:Schema = new Schema({
    userId:{type:String, required:true},
    degree:{type:String, required:true},
    college:{type:String, required:true},
    duration:{
        admissionYear:{type:Number, required:true},
        passYear:{type:Number, required:true},
    },
    marks:{type:Number, required:true}
},{
    timestamps:true,
});

export default model<IUserEducationDetail>("UserEducationDetail",UserEducationDetailSchema);