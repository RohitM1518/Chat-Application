import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client"



const SocketContext = createContext()

export const useSocketContext=()=>{
    return useContext(SocketContext)
}

export const SocketContextProvider=({children})=>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const accessToken = useSelector(state => state?.user?.accessToken)
    const [socket,setSocket] = useState(null);
    // const [onlineUsers, setOnlineUsers] =useState([])
    const user = useDispatch(state => state?.user.currentUser)
    useEffect(()=>{
        console.log("HI from socket context provider")
       try {
         if(user){
             const socket = io(`${backendUrl}`,{
                 auth:{
                     token: accessToken 
                 },
                 withCredentials:true
             })
             setSocket(socket)
             return ()=>socket.close();
         }
         else{
             if(socket){
                 socket.close()
                 setSocket(null)
             }
         }
       } catch (error) {
            console.log("Socket error",error)
       }
    },[user])

    return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
}