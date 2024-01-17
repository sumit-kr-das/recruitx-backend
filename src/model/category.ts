import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document{
    name:string
}

const CategorySchema:Schema = new Schema({
    name:{type:String, required:true},
},{
    timestamps:true
});

export default model<ICategory>('Category',CategorySchema);