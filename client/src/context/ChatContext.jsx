import { createContext, useContext, useState } from "react";

const ChatContext =createContext()

export const useChatContext=()=>{
    return useContext(ChatContext)
}

export const ChatContextProvider =({children})=>{
    const[chat,setChat]=useState({})

    return (
        <ChatContext.Provider value={{chat,setChat}}>
            {children}
        </ChatContext.Provider>
    )
}