import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    isGroupChat:{
        type: Boolean,
        default: false
    },
    lastMessage:{
        type: mongoose.Schema.ObjectId,
        ref:"ChatMessage"
    },
    participants:[
        {
            type: mongoose.Schema.ObjectId,
            ref:"User"
        }
    ],
    admin:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
},{ timestamps:true})

export const Chat = mongoose.model("Chat",chatSchema)