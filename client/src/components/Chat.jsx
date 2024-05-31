import React, { useEffect, useState } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import { useChatContext } from '../context/ChatContext'
import axios from 'axios'

const Chat = () => {
    const [messages,setMessages]=useState([])
    const {chat}= useChatContext()
    useEffect(()=>{
        try {
            async function fetchMessages(){
                const res = await axios.get(`http://localhost:8000/message/${chat._id}`,
                    {
                        withCredentials:true
                    }
                )
                console.log("Hi",res.data.data)
                setMessages(res?.data?.data)
            }
            fetchMessages()
        } catch (error) {
            console.log(error)
        }
        
    },[chat])
  return (
    <div className=' bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full h-screen p-24 flex flex-col justify-between'>
        {messages && <div className=' flex flex-col gap-4 overflow-auto'>
            {
                messages.map((message)=>(
                    <Message message={message} />
                ))
            }
        </div>}
        {messages.length<=0 ? (<div>
            {
                <h1 className=' text-white text-center text-lg opacity-65'>Not Messaged yet</h1>
            }
        </div>):<></>}
        <MessageInput />
    </div>
  )
}

export default Chat