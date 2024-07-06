import { createContext } from "react";
import { useContext } from "react";
import { useState } from "react";

const LoadingContext = createContext()

export const useLoadingContext = ()=>{
    return useContext(LoadingContext)
}

export const LoadingContextProvider=({children})=>{
    const [isLoading, setIsLoading] = useState(false)
    return <LoadingContext.Provider value={{isLoading,setIsLoading}}>
        {children}
    </LoadingContext.Provider>
}