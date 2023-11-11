import { Schema, model, Document  } from "mongoose";

export interface IRating extends Document{
    companyId:string,
    userId:string,
    rating:number
}

const ratingSchema:Schema = new Schema({
    companyId:{type:Schema.Types.ObjectId, ref:"Company", required:true},
    userId:{type:Schema.Types.ObjectId, ref:"User", required:true},
    rating:{type:Number, required:true}
},{
    timestamps:true
});

export default model<IRating>('Rating',ratingSchema);