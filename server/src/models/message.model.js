import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    content:{
        type:String
    },
    attachments:{
        type:[
            {
                url:String,
                localPath: String,
            }
        ],
        default:[]
    },
    chat:{
        type: mongoose.Schema.ObjectId,
        ref:"Chat"
    }
},{ timestamps:true})

export const Message = mongoose.model("Message",messageSchema)