import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import User from './User'
import { useChatContext } from '../context/ChatContext'
import { useNavigate, useParams } from 'react-router-dom'

const UserList = () => {
    const { setChat } = useChatContext();
    const [users, setUsers] = useState([])
    const { userid } = useParams()
    const navigate = useNavigate()
    const accessToken = useSelector(state => state?.user?.accessToken)
    const refreshToken = useSelector(state => state?.user?.currentUser?.refreshToken)
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
            console.log(error)
        }
    }, [])
    useEffect(() => {
        try {
            async function getChat() {
                if (!userid) return
                const res = await axios.post(`http://localhost:8000/chat/c/${userid}`,
                    { refreshToken: refreshToken },
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                );
                setChat(res.data.data)
                const chatid = res?.data?.data?._id
            }
            getChat()
        } catch (error) {
            console.log(error)
        }
    }, [userid])
    return (
        <div className='bg-gradient-to-t from-rose-500 via-purple-500 to-cyan-600 p-10 flex flex-col gap-6 h-screen overflow-auto'>
            {
                users && users.map((user) => (
                    <div key={user._id} className=" hover:cursor-pointer hover:translate-x-1 hover:translate-y-1" onClick={() => { navigate(`/chats/${user._id}`) }}>
                        <User user={user} />
                    </div>
                ))
            }
        </div>
    )
}

export default UserList