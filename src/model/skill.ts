import { Schema, model, Document } from "mongoose";

export interface ISkill extends Document{
    name:string
}

const skillSchema:Schema = new Schema({
    name:{type:String, required:true}
},{
    timestamps:true
});

export default model<ISkill>('Skill',skillSchema);