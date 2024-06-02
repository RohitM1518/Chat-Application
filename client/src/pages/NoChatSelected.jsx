import React from 'react'
import { UserList } from '../components'
import Chat from '../components/Chat'
import { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { ChatContextProvider, useChatContext } from '../context/ChatContext'

const NoChatSelected = () => {
  return (
    <div className=' w-full flex '>
          <ChatContextProvider>
      <div className='flex h-screen'>
        <div>
          <UserList />
        </div>
      </div>
      <div className='bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full h-screen p-24 flex flex-col justify-center items-center'>
        <h1 className=' text-3xl text-white opacity-70'>No Chat Selected</h1>
      </div>
      </ChatContextProvider>
    </div>
  )
}

export default NoChatSelected