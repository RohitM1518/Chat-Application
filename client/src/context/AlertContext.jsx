import { createContext, useContext, useState } from "react";

const Alert = createContext()

export const useAlertContext=()=>{
    return useContext(Alert)
}

export const AlertContextProvider =({children})=>{
    const [alert,setAlert] = useState(false)
    return (
        <Alert.Provider value={{alert,setAlert}}>
            {children}
        </Alert.Provider>
    )
}