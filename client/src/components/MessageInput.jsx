import React, { useState } from 'react'
import { useChatContext } from '../context/ChatContext'
import { Try } from '@mui/icons-material'
import axios from 'axios'
import { errorParser } from '../utils/errorParser'

const MessageInput = () => {
  const {chat,setChat}= useChatContext()
  const[content,setContent] = useState('')
  const sendMessage=async()=>{
    try {
      const res = await axios.post(`http://localhost:8000/message/${chat?._id}`,{content},{
        withCredentials:true,
      })
      setContent('')
      // console.log(res.data.data)
      setChat(res?.data?.data)
      // const messages = await axios.get('http://localhost:8000/chat')
      // console.log(res)
    } catch (error) {
      const errMsg = errorParser(error)
      console.log(errMsg)
    }
  }
  return (
    <div className='flex gap-2'>
        <input type="text" placeholder="Type here" className="input input-bordered input-info w-full sticky" value={content} onChange={(e)=>setContent(e.target.value)}/>
        <button className="btn glass text-white" onClick={sendMessage}>Send</button>
    </div>
  )
}

export default MessageInput