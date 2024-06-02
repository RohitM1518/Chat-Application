import React from 'react'
import { SideBar} from '../components'
import Chat from '../components/Chat'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { ChatContextProvider } from '../context/ChatContext'
import { MessageContextProvider } from '../context/MessageContext'

const ChatPage = () => {

  return (
    <div className=' w-full flex'>
      <ChatContextProvider>
        <MessageContextProvider>
          <div className='flex h-screen'>
            <div>
              <SideBar />
            </div>
          </div>
          <div className='w-full'>
            <Chat />
          </div>
        </MessageContextProvider>
      </ChatContextProvider>
    </div>
  )
}

export default ChatPage