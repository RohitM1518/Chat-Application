import mongoose from "mongoose";
import { ChatMessage } from "../models/message.model.js";
import { removeLocalFile } from "../utils/helper.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Chat } from "../models/chat.model.js";
import { emitSocketEvent } from "../socket/index.js";
import { ChatEventEnum } from "../constants.js";

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
            }
        },
        {
            $lookup: {
                from: "messages",
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
            }
        },
        {
            $addFields: {
                lastMessage: { $first: "$lastMessage" }
            }
        }
    ];
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
    const users = await User.aggregate([
        {
        $match: {
            _id: {
                $ne: req.user._id
            }
        },
    },
    {
        $project: {
        password: 0,
        refreshToken: 0
    }
}
])
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
                    $all: [req.user._id, new mongoose.Types.ObjectId(receiverId)]
                },
                isGroupChat: false
            }
        },
        ...chatCommonAggregation()
    ]);
    
    if (chat.length) {
        // console.log("Chat found",chat[0])
        return res.status(200).json(new ApiResponse(200, chat[0], "Chat Found"))
    }

    const newChat = await Chat.create({
        name: "One on One",
        participants: [req.user._id, new mongoose.Types.ObjectId(receiverId)],
        admin: req.user._id
    })
    // console.log("hi")

    const newChatDetails = await Chat.aggregate([
        {
            $match: {
                _id: newChat._id
            }
        },
        ...chatCommonAggregation()
    ])
    // console.log("hello")
    const payload = newChatDetails[0]
    if (!payload) {
        throw new ApiError(500, "Something went wrong while creating the Chat")
    }
    payload?.participants.forEach((participant) => {
        if (participant.toString() === req.user._id.toString()) return;

        emitSocketEvent(
            req,
            participant._id?.toString(),
            ChatEventEnum.NEW_CHAT_EVENT,
            payload
        )

    })
    return res
        .status(200)
        .json(new ApiResponse(200, newChatDetails[0], "New Chat Created Successfully"))

})

const createAGroupChat = asyncHandler(async (req, res) => {
    const { name, participants } = req.body
    if (!name) {
        throw new ApiError(400, "Name is required")
    }
    if (!participants) {
        throw new ApiError(400, "Participants are required")
    }
    // console.log(name,participants)
    // if (participants.includes(req.user._id.toString())) {
    //     throw new ApiError(
    //         400,
    //         "Participants array should not contain the group creator"
    //     );
    // }
    const members = [...new Set([...participants, req.user._id])];
    if (members.length < 3) {
        throw new ApiError(400, "Atleast Three members needed in the group ")
    }
    // console.log("members",members)
    const groupChat = await Chat.create({
        name,
        isGroupChat: true,
        participants: members,
        admin: req.user._id,
    });
    // console.log("groupchat",groupChat)
    
    const chat = await Chat.aggregate([
        {
            $match: {
                _id: groupChat._id,
            },
        },
        ...chatCommonAggregation(),
    ]);
    // console.log("chat",chat)
    const payload = chat[0]
    if (!payload) {
        throw new ApiError(500, "Something went wrong while creating the group chat")
    }

    payload?.participants.forEach((participant) => {
        if (participant?.toString() === req.user._id.toString()) return;

        emitSocketEvent(
            req,
            participant._id?.toString(),
            ChatEventEnum.NEW_CHAT_EVENT,
            payload
        )
    })

    return res
        .status(200)
        .json(new ApiResponse(200, payload, "Group Chat Created Successfully"))
})

const deleteGroupChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const chat = await Chat.findOne({ _id: new mongoose.Types.ObjectId(chatId), isGroupChat: true })
    if (!chat) {
        throw new ApiError(404, "Chat Not Found")
    }
    
    // console.log("HI",chat)
    // console.log("HI",req.user._id.toString())
    if (chat.admin.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this chat")
    }

    await Chat.deleteOne({ _id: new mongoose.Types.ObjectId(chatId) })
    deleteCascadeChatMessage(chatId)

    chat?.participants?.forEach((participant) => {
        if (participant.toString() === req.user._id.toString()) return
        emitSocketEvent(
            req,
            participant._id?.toString(),
            ChatEventEnum.LEAVE_CHAT_EVENT,
            chat
        )
    })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Chat Deleted Successfully"))
})
const deleteOneOnOneChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const chat = await Chat.findOne({ _id: new mongoose.Types.ObjectId(chatId), isGroupChat: false })
    if (!chat) {
        throw new ApiError(404, "Chat Not Found")
    }
    // console.log("User id",new mongoose.Types.ObjectId(req.user._id))
    if (!chat.participants.includes(req.user._id)) {
        throw new ApiError(403, "You are not authorized to delete this chat")
    }
    await Chat.deleteOne({ _id: new mongoose.Types.ObjectId(chatId) })
    deleteCascadeChatMessage(chatId)

    const otherParticipant = chat?.participants?.filter((participant) => { return participant.toString() !== req.user._id.toString() })
    if (!otherParticipant) {
        throw new ApiError(500, "Something went wrong while deleting the chat")
    }
    emitSocketEvent(
        req,
        otherParticipant,
        ChatEventEnum.LEAVE_CHAT_EVENT,
        chat
    )


    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Chat Deleted Successfully"))
})
const getGroupChats = asyncHandler(async (req, res) => {
    const chats = await Chat.aggregate(
        [
            {
                $match: {
                    participants: {
                        $elemMatch: { $eq: req.user._id }
                    },
                    isGroupChat:true
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            },
            // {
            //     $lookup:{
            //         from:"users",
            //         localField:"participants",
            //         foreignField:"_id",
            //         as:"participants",
            //         pipeline:[
            //             {
            //                 $project:{
            //                     password:0,
            //                     refreshToken:0
            //                 }
            //             }
            //         ]

            //     }
            // },
            ...chatCommonAggregation()
        ]
    )

    return res.status(200).json(new ApiResponse(200, chats, "List of Chats"))

})
const getGroupChat = asyncHandler(async (req, res) => {
    const {chatId} = req.params
    // console.log("Heyyyyy",chatId)
    if(!chatId){
        throw new ApiError(400,"Chat id is required")
    }
    const chat = await Chat.aggregate(
        [
            {
                $match: {
                    _id:new mongoose.Types.ObjectId(chatId),
                    isGroupChat:true
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            },
            // {
            //     $lookup:{
            //         from:"users",
            //         localField:"participants",
            //         foreignField:"_id",
            //         as:"participants",
            //         pipeline:[
            //             {
            //                 $project:{
            //                     password:0,
            //                     refreshToken:0
            //                 }
            //             }
            //         ]

            //     }
            // },
            ...chatCommonAggregation()
        ]
    )
    if(!chat){
        throw new ApiError(400,"NO such chat found")
    }

    return res.status(200).json(new ApiResponse(200, chat[0], "List of Chats"))

})
const getGroupChatDetails = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const groupChat = await Chat.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(chatId),
                isGroupChat: true
            }
        },
        ...chatCommonAggregation()
    ])

    const chat = groupChat[0]
    if (!chat) {
        throw new ApiError(404, "Chat Not Found")
    }
    if (!chat.participants.contains(new mongoose.Types.ObjectId(req.user._id))) {
        throw new ApiError(403, "You are not authorized to view this chat")
    }

    return res.status(200).json(new ApiResponse(200, chat, "Chat Details"))
})
const leaveGroupChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const groupChat = await Chat.findOne({ _id: new mongoose.Types.ObjectId(chatId), isGroupChat: true })
    if (!groupChat) {
        throw new ApiError(404, "No Such Chat found")
    }
    if (!groupChat.participants.includes(new mongoose.Types.ObjectId(req.user._id))) {
        throw new ApiError(403, "You are not a participant of this chat")
    }
    if (groupChat.admin.toString() === req.user._id.toString()) {
        throw new ApiError(403, "Admin can't leave the chat")
    }
    groupChat.participants = groupChat.participants.filter((participant) => {
        return participant.toString() !== req.user._id.toString()
    })
    await groupChat.save()
    groupChat?.participants?.forEach((participant) => {
        emitSocketEvent(
            req,
            participant._id?.toString(),
            ChatEventEnum.LEAVE_CHAT_EVENT,
            groupChat
        )
    })

    return res.status(200).json(new ApiResponse(200, groupChat, "You have left the chat"))
})
const addNewParticipantInGroupChat = asyncHandler(async (req, res) => {
    const { chatId, participantId } = req.params
    // console.log("Chat id",chatId)
    // console.log("Participant id",participantId)
    if (!participantId) {
        throw new ApiError(400, "Participant is required")
    }
    const groupChat = await Chat.findOne({ _id: new mongoose.Types.ObjectId(chatId), isGroupChat: true })
    if (!groupChat) {
        throw new ApiError(404, "No Such Group Chat found")
    }
    // console.log("Group chat",groupChat.participants)
    if (groupChat?.participants.indexOf(new mongoose.Types.ObjectId(participantId)) !== -1) {
        throw new ApiError(403, "Participant already exists in the chat")
    }
    if (groupChat.admin.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to add the participants in the chat")
    }
    groupChat.participants.push(participantId)
    await groupChat.save()
    const payload = await Chat.aggregate([{
        $match: {
            _id: new mongoose.Types.ObjectId(chatId)
        },  
    },
    ...chatCommonAggregation()
])
    payload?.participants?.forEach((participant) => {
        emitSocketEvent(req, participant?._id, ChatEventEnum.NEW_CHAT_EVENT, payload)
    })

    return res.status(200).json(new ApiResponse(200, payload, "Participant added to the chat"))
})

const removeParticipantFromGroupChat = asyncHandler(async (req, res) => {
    const { chatId, participantId } = req.params
    if (!participantId) {
        throw new ApiError(400, "User id is required")
    }
    const chat = await Chat.findOne({
        _id: new mongoose.Types.ObjectId(chatId), isGroupChat: true
    })
    if (!chat) {
        throw new ApiError(404, "No Such Group Chat found")
    }
    if (chat.participants.indexOf(new mongoose.Types.ObjectId(participantId)) == -1) {
        throw new ApiError(403, "No Such participant found the group")
    }
    if (chat.admin.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to remove the participants from the group")
    }
    chat.participants = chat.participants.filter((participant) => {
        return participant.toString() !== participantId.toString()
    })
    await chat.save()
    const payload = await Chat.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(chatId)
            },
        },
        ...chatCommonAggregation()
    ])
    emitSocketEvent(req, participantId, ChatEventEnum.LEAVE_CHAT_EVENT, payload[0]);
    return res.status(200).json(new ApiResponse(200, payload[0], "Participant removed from the chat"))
})
const renameGroupChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const { name } = req.body
    if (!name) {
        throw new ApiError(400, "Name is required")
    }
    const groupChat = await Chat.findOne({
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: true
    })
    if (!groupChat) {
        throw new ApiError(404, "No Such Group Chat found")
    }
    if (groupChat.admin.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to rename the chat")
    }
    groupChat.name = name
    await groupChat.save()

    const chat = await Chat.aggregate([{
        $match: {
            _id: new mongoose.Types.ObjectId(chatId)
        },
    },
    ...chatCommonAggregation()

])

    const payload = chat[0]
    if (!payload) {
        throw new ApiError(500, "Something went wrong while updating")
    }

    payload?.participants?.forEach((participant) => {
        if (participant.toString() === req.user._id.toString()) return;
        emitSocketEvent(
            req,
            participant._id?.toString(),
            ChatEventEnum.UPDATE_GROUP_NAME_EVENT,
            payload
        )
    })
    return res.status(200).json(new ApiResponse(200, payload, "Chat renamed successfully"))
})


export {
    addNewParticipantInGroupChat,
    createAGroupChat,
    createOrGetAOneOnOneChat,
    deleteGroupChat,
    deleteOneOnOneChat,
    getGroupChats,
    getGroupChatDetails,
    leaveGroupChat,
    removeParticipantFromGroupChat,
    renameGroupChat,
    searchAvailableUsers,
    getGroupChat
};
