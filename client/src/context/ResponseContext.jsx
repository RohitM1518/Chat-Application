import { createContext } from "react";
import { useContext } from "react";
import { useState } from "react";

const ResposeContext = createContext()

export const useResponseContext = ()=>{
    return useContext(ResposeContext)
}

export const ResponseContextProvider=({children})=>{
    const [response, setResponse] = useState('')
    return <ResposeContext.Provider value={{response,setResponse}}>
        {children}
    </ResposeContext.Provider>
}