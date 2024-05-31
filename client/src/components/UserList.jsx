import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import User from './User'

const UserList = () => {
    const accessToken = useDispatch(state=>state?.user?.accessToken)
    const [users,setUsers]=useState([])
    useEffect(() => {
        try {
            async function userlist() {
                const res = await axios.get("http://localhost:8000/chat/users", {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                console.log(res.data.data)
                setUsers(res.data.data)
            }
            userlist()
        } catch (error) {

        }
    }, [])
    return (
        <div className='bg-gradient-to-t from-rose-500 via-purple-500 to-cyan-600 p-10 flex flex-col gap-6 h-screen '>
        {
            users && users.map((user)=>(
                <div key={user._id} className=" hover:cursor-pointer hover:translate-x-1 hover:translate-y-1">
                    <User user={user}/>
                </div>
            ))
        }
        </div>
    )
}

export default UserList