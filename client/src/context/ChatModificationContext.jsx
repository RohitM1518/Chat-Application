import { createContext, useContext, useState } from "react";

const ChatModification = createContext()

export const useChatModification=()=>{
    return useContext(ChatModification)
}

export const ChatModificationProvider =({children})=>{
    const [modification,setModification] = useState('')
    return (
        <ChatModification.Provider value={{modification,setModification}}>
            {children}
        </ChatModification.Provider>
    )
}