import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useChatContext } from '../context/ChatContext';
import { useMessageContext } from '../context/MessageContext';
import { Button } from '@mui/material';

const Message = ({ message }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isSender, setIsSender] = useState(false);
    const {chat}= useChatContext()
    const {setMessages} = useMessageContext()
    const user = useSelector(state => state?.user?.currentUser);
    const accessToken = useSelector(state=>state?.user?.accessToken)
    useEffect(() => {
        if (message?.sender?._id === user?._id) {
            setIsSender(true);
        }
    }, [message, user]);
    const deleteMessage = async()=>{
        try {
            await axios.delete(`${backendUrl}/message/${chat._id}/${message._id}`,{
                withCredentials:true,
                headers:{
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            setMessages(prevMsgs=>prevMsgs.filter(msg=>msg._id != message._id))
        } catch (error) {
            
        }
    }
    const formattedDate = format(new Date(message?.createdAt), 'Pp');

    return (
        <div className="relative group">
            <div className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}>
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="" src={message?.sender?.avatar} />
                    </div>
                </div>
                <div className="chat-header text-white">
                    {isSender ? 'Me' : message?.sender?.fullName}
                </div>
                <div className="chat-bubble">{message?.content}</div>
                <div className="chat-footer text-white">
                    <time className="text-xs opacity-80">{formattedDate}</time>
                </div>
            </div>
            {isSender && (
                <div className="absolute top-4 left-4 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={deleteMessage}>
                    <Button sx={{color:"white"}} variant='outlined' color='error'>
                    <DeleteIcon className=" text-red-600 cursor-pointer" /> {"Delete"} 
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Message;
