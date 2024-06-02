import React, { useEffect, useRef, useState } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { useChatContext } from '../context/ChatContext';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useMessageContext } from '../context/MessageContext';

const Chat = () => {
    const { messages, setMessages } = useMessageContext();
    const { chat } = useChatContext();
    const accessToken = useSelector(state => state?.user?.accessToken);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/message/${chat?._id}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setMessages(res?.data?.data);
            } catch (error) {
                console.log(error);
            }
        };

        if (chat?._id) {
            fetchMessages();
        }
    }, [chat, accessToken, setMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className='bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full h-screen p-24 flex flex-col justify-between' >
            <div className='flex flex-col gap-4 overflow-auto h-screen'>
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div key={message._id} >
                            <Message message={message} />
                        </div>
                    ))
                ) : (
                    <h1 className='text-white text-center text-lg opacity-65'>No messages yet</h1>
                )}
                <div ref={messagesEndRef}/>
            </div>
            <MessageInput />
        </div>
    );
};

export default Chat;
