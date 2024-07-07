import React from 'react'
import { SideBar } from '../components'
import Chat from '../components/Chat'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { ChatContextProvider, useChatContext } from '../context/ChatContext'
import { MessageContextProvider } from '../context/MessageContext'
import { ChatModificationProvider } from '../context/ChatModificationContext'
import { AlertContextProvider } from '../context/AlertContext'
import { useSidebarContext } from '../context/SidebarContext'
import { useParams } from 'react-router-dom'
import { useLoadingContext } from '../context/LoadingContext'


const ChatPage = () => {
  const {isSidebar,setIsSidebar}=useSidebarContext()
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const accessToken = useSelector(state=>state.user.accessToken)
  const {chat,setChat}=useChatContext()
  const {isLoading,setIsLoading}=useLoadingContext()
  const {id}=useParams()
  const {groupid}=useParams()

  useEffect(()=>{
    // console.log("HIiiiiiiiiiiiiiiiiiiiii",id)
    const getChat=async()=>{
      try {
        setIsLoading(true)
        if(!id && !groupid) return
        var res;
        if(id){
        res = await axios.post(`${backendUrl}/chat/c/${id}`,{},{
          withCredentials:true,
          headers:{
            'Authorization':`Bearer ${accessToken}`
          }
        })
      }
        if(groupid){
        res = await axios.get(`${backendUrl}/chat/group/${groupid}`,{
          withCredentials:true,
          headers:{
            'Authorization':`Bearer ${accessToken}`
          }
        })
      }
        // console.log("Response",res.data)
        setChat(res.data.data)
      } catch (error) {
        console.log(error)
      }
      finally{
        setIsLoading(false)
      }
    }
    getChat()
  },[id,groupid])
  return (
    <div className='w-full flex'>
      <ChatModificationProvider>
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
      </ChatModificationProvider>
    </div>
  )
}

export default ChatPage