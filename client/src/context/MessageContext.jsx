import { createContext, useContext, useState } from "react";

const MessageContext = createContext()

export const useMessageContext =()=>{
    return useContext(MessageContext)
}

export const MessageContextProvider=({children})=>{
    const [messages,setMessages] = useState([])
    return(
        <MessageContext.Provider value={{messages,setMessages}}>
            {children}
        </MessageContext.Provider>
    )
}