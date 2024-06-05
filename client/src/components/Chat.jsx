import React, { useEffect, useRef, useState } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { useChatContext } from '../context/ChatContext';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useMessageContext } from '../context/MessageContext';
import { useChatModification } from '../context/ChatModificationContext';
import User from './User';
import CancelIcon from '@mui/icons-material/Cancel';
import { Card } from '@mui/material';
import { useAlertContext } from '../context/AlertContext';
import Alert from './Alert';

const Chat = () => {
    const { messages, setMessages } = useMessageContext();
    const { chat } = useChatContext();
    const [users, setUsers] = useState([])
    const {alert} = useAlertContext()
    const accessToken = useSelector(state => state?.user?.accessToken);
    const messagesEndRef = useRef(null);
    const { modification, setModification } = useChatModification()
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:8000/chat/users", {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (chat?.participants && Array.isArray(res.data.data)) {
                    const participantIds = chat.participants.map(participant => participant.toString()); // Convert to string if they are ObjectIds
                    const filteredUsers = res.data.data.filter(user => !participantIds.includes(user._id.toString())); // Convert user._id to string
                    setUsers(filteredUsers);
                } else {
                    // Handle cases where chat.participants or res.data.data are not properly defined
                    setUsers([]);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers()
    }, [chat])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/message/${chat?._id}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log("Chat Msg res", res.data.data)
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

    const handleCancel = () => {
        setModification('')
    }
    return (
        <div className={`bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full h-screen p-24 flex flex-col justify-between ${alert?" p-20":""}`} >
            {alert && <Alert />}
            {
                modification === 'remove' ? (
                    <div className=' max-w-lg flex flex-col gap-4 min-h-96 overflow-auto'>
                        <div onClick={handleCancel} className=' hover:cursor-pointer'><CancelIcon /></div>
                        {chat?.participants.map((user) => (
                            <div className=' hover:cursor-pointer'>
                                <User user={user} deleteButton={true} />
                            </div>
                        ))
                        }
                    </div>
                ) : (
                    <div></div>
                )
            }
            {
                modification === 'add' ? (
                    <div className=' max-w-lg flex flex-col gap-4 min-h-96 overflow-auto'>
                        {alert && <Alert />}
                        <div onClick={handleCancel} className=' hover:cursor-pointer'><CancelIcon /></div>
                        {users?.map((user) => (
                            <div className=' hover:cursor-pointer'>
                                <User user={user} addButton={true} />
                            </div>
                        ))
                        }
                    </div>
                ) : (
                    <div></div>
                )
            }
            {
                modification == 'exit' ? (<div>
                    <div className="card w-96 bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Are you sure?</h2>
                            <p>This action will remove you as a part of group and you will not recieve any messages in future.</p>
                            <div className="card-actions justify-around">
                                <button className='btn bg-slate-700 hover:bg-slate-700 w-24' onClick={handleCancel}>
                                <CancelIcon />
                                </button>
                                <button className="btn bg-red-700 w-24 hover:bg-red-600">Exit</button>
                            </div>
                        </div>
                    </div>
                </div>) : (<div></div>)
            }
            {
                modification == 'delete' ? (<div>
                    <div className="card w-96 bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Are you sure?</h2>
                            <p>This action will delete the group.</p>
                            <div className="card-actions justify-around">
                                <button className='btn bg-slate-700 hover:bg-slate-700 w-24' onClick={handleCancel}>
                                <CancelIcon />
                                </button>
                                <button className="btn bg-red-700 w-24 hover:bg-red-600">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>) : (<div></div>)
            }

            <div className={`flex flex-col gap-4 overflow-auto h-screen ${modification == '' ? "" : " blur-xl"}`}>
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div key={message._id} >
                            <Message message={message} />
                        </div>
                    ))
                ) : (
                    <h1 className='text-white text-center text-lg opacity-65'>No messages yet</h1>
                )}
                <div ref={messagesEndRef} />
            </div>
            <MessageInput />
        </div>
    );
};

export default Chat;
