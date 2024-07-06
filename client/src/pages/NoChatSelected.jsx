import React from 'react'
import { SideBar } from '../components'
import { ChatContextProvider } from '../context/ChatContext'
import { MessageContextProvider } from '../context/MessageContext'
import { ChatModificationProvider } from '../context/ChatModificationContext'
import { AlertContextProvider } from '../context/AlertContext'
import { useSidebarContext } from '../context/SidebarContext'

const NoChatSelected = () => {
  const { isSidebar } = useSidebarContext()
  return (
    <div className='w-full flex '>
      <ChatModificationProvider>
        <ChatContextProvider>
          <MessageContextProvider>
            <AlertContextProvider>
              <div className='flex h-screen max-lg:w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'>
                {!isSidebar &&
                  <div className=' hidden w-full max-lg:flex justify-center items-center'>
                    <h1 className=' text-3xl text-white opacity-70'>No Chat Selected</h1>
                  </div>}
                {isSidebar && <div className=' flex max-lg:w-full'>
                  <SideBar />
                </div>
                }
              </div>
              <div className='bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full h-screen p-24 flex flex-col justify-center items-center max-lg:hidden'>
                <h1 className=' text-3xl text-white opacity-70'>No Chat Selected</h1>
              </div>
            </AlertContextProvider>
          </MessageContextProvider>
        </ChatContextProvider>
      </ChatModificationProvider>
    </div>
  )
}

export default NoChatSelected