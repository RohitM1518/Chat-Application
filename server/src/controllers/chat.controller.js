import mongoose from "mongoose";
import { ChatMessage } from "../models/message.model.js";
import { removeLocalFile } from "../utils/RemoveLocalFile";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Chat } from "../models/chat.model.js";

const chatCommonAggregation = () => {
    return [
        {
            $lookup: {
                from: "users",
                localField: "participants",
                foreignField: "_id",
                as: "participants",
                pipeline: [
                    {
                        $project: {
                            password: 0,
                            refreshToken: 0
                        }
                    }
                ]
            },
            $lookup: {
                from: "chatmessages",
                localField: "lastMessage",
                foreignField: "_id",
                as: "lastMessage",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "sender",
                            foreignField: "_id",
                            as: "sender",
                            pipeline: [
                                {
                                    $project: {
                                        password: 0,
                                        refreshToken: 0
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            sender: { $first: "$sender" }
                        }
                    }
                ]
            },

        }, {
            $addFields: {
                lastMessage: { $first: "$lastMessage" }
            }
        }
    ]
}

const deleteCascadeChatMessage = async (chatId) => {
    const messages = await ChatMessage.find({
        chat: new mongoose.Types.ObjectId(chatId)
    })
    let attachments = []

    attachments = attachments.concat(
        ...messages.map((message) => {
            return message.attachments
        })
    )

    attachments.forEach((attachment) => {
        removeLocalFile(attachment.localPath)
    })

    await ChatMessage.deleteMany({
        chat: new mongoose.Types.ObjectId(chatId)
    })

}

const searchAvailableUsers = asyncHandler(async (req, res) => {
    const users = await User.aggregate({
        $match: {
            _id: {
                $ne: req.user._id
            }
        },
        $project: {
            password: 0,
            refreshToken: 0
        }
    })
    return res.status(200).json(new ApiResponse(200, users, "List of Users"))
})


const createOrGetAOneOnOneChat = asyncHandler(async (req, res) => {
    const { receiverId } = req.params
    const receiver = User.findById(receiverId)
    if (!receiver) {
        throw new ApiError(400, "Receiver not Found")
    }
    //Check wether the chat already exists 
    //if exists change do create else create new chat
    const chat = await Chat.aggregate([
        {
            $match: {
                participants: {
                    $all: [req.user._id, receiverId]
                },
                isGroupChat: false
            }
        },
        ...chatCommonAggregation()
    ]);

    if (chat.length) {
        return res.status(200).json(new ApiResponse(200, chat[0], "Chat Found"))
    }

    const newChat = await Chat.create({
        name: "One on One",
        participants: [req.user._id, new mongoose.Types.ObjectId(receiverId)],
        admin: req.user._id
    })

    const newChatDetails = await Chat.aggregate({
        $match: {
            _id: newChat._id
        },
        ...chatCommonAggregation()
    })

    payload =newChatDetails[0]
    if (!payload) {
        throw new ApiError(500, "Something went wrong while creating the Chat")
    }
    payload?.participants.forEach((participant)=>{
        if(participant.toString() === req.user._id.toString()) return;

        //205
        
    })
    return res
        .status(200)
        .json(new ApiResponse(200, newChatDetails[0], "New Chat Created Successfully"))

})

const createAGroupChat = asyncHandler(async (req, res) => {
    const {name,participants}= req.body
    if(!name){
        throw new ApiError(400,"Name is required")
    }
    if(!participants){
        throw new ApiError(400,"Participants are required")
    }

    if (participants.includes(req.user._id.toString())) {
        throw new ApiError(
          400,
          "Participants array should not contain the group creator"
        );
      }
    const members =[...new Set([...participants,req.user._id])];
    if (members.length<3){
        throw new ApiError(400,"Atleast Three members needed in the group ")
    }

    const groupChat = await Chat.create({
        name,
        isGroupChat: true,
        participants: members,
        admin: req.user._id,
      });

      const chat = await Chat.aggregate([
        {
          $match: {
            _id: groupChat._id,
          },
        },
        ...chatCommonAggregation(),
      ]);

      if(!chat){
        throw new ApiError(500,"Something went wrong while creating the group chat")
      }

      return res
      .status(200)
      .json(new ApiResponse(200,chat,"Group Chat Created Successfully"))
})

const deleteGroupChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const chat = await Chat.find({ _id: new mongoose.Types.ObjectId(chatId), isGroupChat: true })
    if (!chat) {
        throw new ApiError(404, "Chat Not Found")
    }
    if (chat.admin.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this chat")
    }

    deleteCascadeChatMessage(chatId)
    await Chat.deleteOne({ _id: new mongoose.Types.ObjectId(chatId) })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Chat Deleted Successfully"))
})
const deleteOneOnOneChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const chat = await Chat.find({ _id: new mongoose.Types.ObjectId(chatId), isGroupChat: false })
    if (!chat) {
        throw new ApiError(404, "Chat Not Found")
    }
    if (chat.participants.contains(new mongoose.Types.ObjectId(req.user._id))) {
        throw new ApiError(403, "You are not authorized to delete this chat")
    }

    deleteCascadeChatMessage(chatId)
    await Chat.deleteOne({ _id: new mongoose.Types.ObjectId(chatId) })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Chat Deleted Successfully"))
})
const getAllChats = asyncHandler(async (req, res) => {
    const chats = await Chat.aggregate(
        [
            {
                $match: {
                    participants: {
                        $elemMatch: {$eq:req.user._id}
                    }
                }
            },
            {
                $sort:{
                    updatedAt:-1
                }
            },
            ...chatCommonAggregation()
        ]
    )

    return res.status(200).json(new ApiResponse(200, chats, "List of Chats"))

})
const getGroupChatDetails = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const chat = await Chat.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(chatId),
                isGroupChat: true
            }
        },
        ...chatCommonAggregation()
    ])

    if (!chat) {
        throw new ApiError(404, "Chat Not Found")
    }

    return res.status(200).json(new ApiResponse(200, chat, "Chat Details"))
})
const leaveGroupChat = asyncHandler(async (req, res) => {
    const {chatId} = req.params
    const chat = await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"No Such Chat found")
    }
    if(!chat.participants.contains(new mongoose.Types.ObjectId(req.user._id))){
        throw new ApiError(403,"You are not a participant of this chat")
    }
    if(chat.admin.toString() === req.user._id.toString()){
        throw new ApiError(403,"Admin can't leave the chat")
    }
    chat.participants = chat.participants.filter((participant) => {
        return participant.toString() !== req.user._id.toString()
    })
    await chat.save()
    return res.status(200).json(new ApiResponse(200,{}, "You have left the chat"))
})
const addNewParticipantInGroupChat = asyncHandler(async(req,res)=>{
    const {chatId} = req.params
    const {participant} = req.body
    if(!participant){
        throw new ApiError(400,"Participant is required")
    }
    const chat = await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"No Such Chat found")
    }
    if(chat?.participants.contains(new mongoose.Types.ObjectId(participant))){
        throw new ApiError(403,"Participant already exists in the chat")
    }
    chat.participants.push(participant)
    await chat.save()
    return res.status(200).json(new ApiResponse(200,{}, "Participant added to the chat"))  
})

const removeParticipantFromGroupChat = asyncHandler(async (req, res) => {
    const {chatId,userId} = req.params
    if(!userId){
        throw new ApiError(400,"User id is required")
    }
    const chat = await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"No Such Chat found")
    }
    if(!chat.participants.contains(new mongoose.Types.ObjectId(userId))){
        throw new ApiError(403,"No Such participant found the group")
    }
    if(chat.admin.toString() !== req.user._id.toString()){
        throw new ApiError(403,"You are not authorized to remove the participants from the group")
    }
    chat.participants = chat.participants.filter((participant) => {
        return participant.toString() !== userId.toString()
    })
    await chat.save()
    return res.status(200).json(new ApiResponse(200,{}, "Participant removed the chat"))
})
const renameGroupChat = asyncHandler(async (req, res) => {
    const {chatId} = req.params
    const {name} = req.body
    if(!name){
        throw new ApiError(400,"Name is required")
    }
    const chat = await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"No Such Chat found")
    }
    if(chat.admin.toString() !== req.user._id.toString()){
        throw new ApiError(403,"You are not authorized to rename the chat")
    }
    chat.name = name
    await chat.save()
    return res.status(200).json(new ApiResponse(200,{}, "Chat renamed successfully"))
})



