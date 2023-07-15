import { Schema, model, Document } from "mongoose";

export interface IUserExprience extends Document{
    userId:string,
    skills:[string],
    companyName:string,
    duration:{
        startDate:Date,
        endDate?:Date,
    }
    place:string
}

const UserExprienceSchema:Schema = new Schema({
    userId:{type:String, required:true},
    skills:{type:Array, required:true},
    companyName:{type:String, required:true},
    duration:{
        startDate:{type:Date, required:true},
        endDate:{type:Date}
    },
    place:String
},{
    timestamps:true
})


export default model<IUserExprience>("UserExprience",UserExprienceSchema);