import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import User from './User'
import { useChatContext } from '../context/ChatContext'

const UserList = ({users}) => {
    const {setChat} = useChatContext();
    const accessToken = useDispatch(state => state?.user?.accessToken)
    const refreshToken = useDispatch(state => state?.user?.currentUser?.refreshToken)
    const openChat=async(user)=>{
        try {
                const res = await axios.post(`http://localhost:8000/chat/c/${user._id}`,
                { refreshToken: refreshToken },
                {
                  withCredentials: true,
                  headers: {
                    'Authorization': `Bearer ${accessToken}`
                  }
                }
              );
                // console.log(res.data.data)
                setChat(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='bg-gradient-to-t from-rose-500 via-purple-500 to-cyan-600 p-10 flex flex-col gap-6 h-screen overflow-auto'>
        {
            users && users.map((user)=>(
                <div key={user._id} className=" hover:cursor-pointer hover:translate-x-1 hover:translate-y-1" onClick={()=>{openChat(user)}}>
                    <User user={user}/>
                </div>
            ))
        }
        </div>
    )
}

export default UserList