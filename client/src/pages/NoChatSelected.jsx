import React from 'react'
import { SideBar} from '../components'
import { ChatContextProvider } from '../context/ChatContext'
import { MessageContextProvider } from '../context/MessageContext'

const NoChatSelected = () => {
  return (
    <div className=' w-full flex '>
          <ChatContextProvider>
          <MessageContextProvider>
      <div className='flex h-screen'>
        <div>
          <SideBar />
        </div>
      </div>
      <div className='bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full h-screen p-24 flex flex-col justify-center items-center'>
        <h1 className=' text-3xl text-white opacity-70'>No Chat Selected</h1>
      </div>
      </MessageContextProvider>
      </ChatContextProvider>
    </div>
  )
}

export default NoChatSelected