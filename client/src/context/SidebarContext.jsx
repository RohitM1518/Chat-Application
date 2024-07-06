import { createContext, useContext, useState } from "react";

const SidebarContext =createContext()

export const useSidebarContext=()=>{
    return useContext(SidebarContext)
}

export const SidebarContextProvider =({children})=>{
    const[isSidebar,setIsSidebar]=useState(false)
    return (
        <SidebarContext.Provider value={{isSidebar,setIsSidebar}}>
            {children}
        </SidebarContext.Provider>
    )
}