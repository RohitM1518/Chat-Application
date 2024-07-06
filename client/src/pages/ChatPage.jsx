import React from 'react'
import { SideBar } from '../components'
import Chat from '../components/Chat'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { ChatContextProvider } from '../context/ChatContext'
import { MessageContextProvider } from '../context/MessageContext'
import { ChatModificationProvider } from '../context/ChatModificationContext'
import { AlertContextProvider } from '../context/AlertContext'
import { useSidebarContext } from '../context/SidebarContext'


const ChatPage = () => {
  const {isSidebar,setIsSidebar}=useSidebarContext()
  return (
    <div className='w-full flex'>
      <ChatModificationProvider>
        <ChatContextProvider>
          <MessageContextProvider>
            <AlertContextProvider>
              <div className={`flex flex-col ${isSidebar?'':' flex-row'}min-h-screen bg-gradient-to-r from-blue-500 to-blue-500 `}>
                {isSidebar && <div className='max-lg:fixed z-20 max-lg:w-full'>
                  <SideBar />
                </div>}
              </div>
              <div className={`w-full ${isSidebar?"":""}`}>
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