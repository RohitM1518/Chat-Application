import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns';

const Message = ({ message }) => {
    const [isSender,setIsSender]= useState(false)
    const user = useSelector(state=>state?.user?.currentUser)
    useEffect(()=>{
        if(message?.sender?._id==user?._id){
            setIsSender(true)
        }
    },[])
    const formattedDate = format(new Date(message?.createdAt), 'PPpp');
    return (
        <div>
            <div className={`chat ${isSender?'chat-end':'chat-start'}`}>
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="" src={message?.sender?.avatar} />
                    </div>
                </div>
                <div className="chat-header text-white">
                    {isSender?'Me':message?.sender?.fullName}
                </div>
                <div className="chat-bubble">{message?.content}</div>
                <div className="chat-footer text-white">
                    <time className="text-xs opacity-80">{formattedDate}</time>
                </div>
            </div>

        </div>
    )
}

export default Message