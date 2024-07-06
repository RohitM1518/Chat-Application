import { createContext } from "react";
import { useContext } from "react";
import { useState } from "react";

const ErrorContext = createContext()

export const useErrorContext = ()=>{
    return useContext(ErrorContext)
}

export const ErrorContextProvider=({children})=>{
    const [error, setError] = useState('')
    return <ErrorContext.Provider value={{error,setError}}>
        {children}
    </ErrorContext.Provider>
}