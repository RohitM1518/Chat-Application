import React from 'react'
import { UserList } from '../components'
import Chat from '../components/Chat'
import { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { ChatContextProvider } from '../context/ChatContext'
import { MessageContextProvider } from '../context/MessageContext'

const ChatPage = () => {

  return (
    <div className=' w-full flex'>
      <MessageContextProvider>
      <ChatContextProvider>
      <div className='flex h-screen'>
        <div>
          <UserList />
        </div>
      </div>
      <div className='w-full'>
        <Chat />
      </div>
      </ChatContextProvider>
      </MessageContextProvider>
    </div>
  )
}

export default ChatPage