import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ChatMessage } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { removeLocalFile } from "../utils/helper.js";
import { getStaticFilePath } from "../utils/helper.js";
import { getLocalPath } from "../utils/helper.js";
import { emitSocketEvent } from "../socket/index.js";
import { ChatEventEnum } from "../constants.js";

const chatMessageCommonAggregation = () => {
    return [
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "sender",
                as: "sender",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            avatar: 1,
                            email: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                sender: { $first: "$sender" },
            },
        },
    ];
};
const getAllMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId)
    if (!chat) {
        throw new ApiError(400, "No Such Chat found")
    }
    if (chat?.participants?.indexOf(req.user._id) === -1) {
        throw new ApiError(401, "User is not part of the group")
    }
    const messages = await ChatMessage.aggregate([
        {   
            $match:{
             chat: new mongoose.Types.ObjectId(chatId)
             }
        },
        {
            $sort:{
                createdAt:1
            }
        },
        ...chatMessageCommonAggregation()
    ])


    return res
        .status(200)
        .json(new ApiResponse(200, messages, "Messages found successfully"))
})
const sendMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content && !req?.files?.attachments?.length) {
        throw new ApiError(400, "Content or attachments are required")
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
        throw new ApiError(400, "No Such Chat found");
    }
    const messageFiles = []
    if (req.files && req.files.attachments?.length > 0) {
        req.files.attachments?.map((attachment) => {
            messageFiles.push({
                url: getStaticFilePath(req, attachment.filename),
                localPath: getLocalPath(attachment.filename),
            });
        });
    }

    const message = await ChatMessage.create({
        sender: req.user._id,
        content: content || "",
        attachments: messageFiles,
        chat: chatId,
    });

    await Chat.findByIdAndUpdate(chatId, {
        $set: {
            lastMessage: message._id
        }
    }, { new: true })

    const messages = await ChatMessage.aggregate([
        {
            $match: { chat: new mongoose.Types.ObjectId(chatId) }
        },
        {
            $sort: { createdAt: -1 }
        },
        ...chatMessageCommonAggregation()
    ])

    const receivedMessage = messages[0]

    if (!receivedMessage) {
        throw new ApiError(500, "Internal server error");
    }

    chat.participants.forEach((participantObjectId) => {
        // here the chat is the raw instance of the chat in which participants is the array of object ids of users
        // avoid emitting event to the user who is sending the message
        if (participantObjectId.toString() === req.user._id.toString()) return;

        // emit the receive message event to the other participants with received message as the payload
        emitSocketEvent(
            req,
            participantObjectId.toString(),
            ChatEventEnum.MESSAGE_RECEIVED_EVENT,
            receivedMessage
        );
    });

    return res
        .status(201)
        .json(new ApiResponse(201, messages, "Message saved successfully"));


})
const deleteMessage = asyncHandler(async (req, res) => {
    const { chatId, messageId } = req.params;
    const chat = await Chat.findById(chatId)
    if (!chat) {
        throw new ApiError(400, "No such Chat found")
    }
    if (chat.participants.indexOf(req.user._id) === -1) {
        throw new ApiError(401, "User is not part of the group")
    }
    const message = await ChatMessage.findOne({ _id: new mongoose.Types.ObjectId(messageId), chat: chat._id })
    if (!message) {
        throw new ApiError(400, "No such message found")
    }
    if (message.sender.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "You are not authorised to delete the message as you are not the sender")
    }
    if (message.attachments.length > 0) {
        //If the message is attachment  remove the attachments from the server
        message.attachments.map((asset) => {
            removeLocalFile(asset.localPath);
        });
    }
    await ChatMessage.findByIdAndDelete(messageId)

    if (chat.lastMessage.toString() === message._id.toString()) {
        const lastMessage = await ChatMessage.findOne({ chat: chatId }).sort({ createdAt: -1 })
        await Chat.findByIdAndUpdate(chatId, {
            $set: {
                lastMessage: lastMessage?._id || null
            }
        }, { new: true })
    }

    chat.participants.forEach((participantObjectId) => {
        // here the chat is the raw instance of the chat in which participants is the array of object ids of users
        // avoid emitting event to the user who is deleting the message
        if (participantObjectId.toString() === req.user._id.toString()) return;
        // emit the delete message event to the other participants frontend with delete messageId as the payload
        emitSocketEvent(
            req,
            participantObjectId.toString(),
            ChatEventEnum.MESSAGE_DELETE_EVENT,
            message
        );
    });

    return res
        .status(200)
        .json(new ApiResponse(200, message, "Message deleted successfully"));

})

export { getAllMessages, sendMessage, deleteMessage };