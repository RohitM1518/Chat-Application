import React from 'react'
import { SideBar} from '../components'
import Chat from '../components/Chat'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { ChatContextProvider } from '../context/ChatContext'
import { MessageContextProvider } from '../context/MessageContext'
import { ChatModificationProvider } from '../context/ChatModificationContext'
import { AlertContextProvider } from '../context/AlertContext'

const ChatPage = () => {

  return (
    <div className=' w-full flex'>
      <ChatModificationProvider>
      <ChatContextProvider>
        <MessageContextProvider>
      <AlertContextProvider>
          <div className='flex h-screen'>
            <div>
              <SideBar />
            </div>
          </div>
          <div className='w-full'>
            <Chat />
          </div>
      </AlertContextProvider>
        </MessageContextProvider>
      </ChatContextProvider>
      </ChatModificationProvider>
    </div>
  )
}

export default ChatPage