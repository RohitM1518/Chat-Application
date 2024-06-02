import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import User from './User';
import { useChatContext } from '../context/ChatContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { errorParser } from '../utils/errorParser';
import GroupList from './GroupList';

const SideBar = () => {
    const { setChat } = useChatContext();
    const [showUsers, setShowUsers] = useState(true)
    const [status, setStatus] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [groupName, setGroupName] = useState('')
    const { id } = useParams();
    const navigate = useNavigate();
    const accessToken = useSelector(state => state?.user?.accessToken);
    const refreshToken = useSelector(state => state?.user?.currentUser?.refreshToken);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:8000/chat/users", {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setUsers(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const getChat = async () => {
            try {
                if (!id) return;
                const res = await axios.post(`http://localhost:8000/chat/c/${id}`, { refreshToken }, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setChat(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getChat();
    }, [id]);

    const handleCheckboxChange = (userId) => {
        setSelectedUserIds(prevSelectedUserIds => {
            if (prevSelectedUserIds.includes(userId)) {
                // If the user ID is already selected, remove it from the array
                return prevSelectedUserIds.filter(id => id !== userId);
            } else {
                // If the user ID is not selected, add it to the array
                return [...prevSelectedUserIds, userId];
            }
        });
    };

    const createAGroupChat = async () => {
        try {
            const payload = {
                participants: selectedUserIds,
                name: groupName
            }
            console.log("payload", payload)
            await axios.post('http://localhost:8000/chat/group', payload, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            setStatus(false)
        } catch (error) {
            const errMsg = errorParser(error)
            console.log(error)
            console.log(errMsg)
        }
    }

    return (
        <div className='bg-gradient-to-t from-rose-500 via-purple-500 to-cyan-600 py-10 px-2 w-96 flex flex-col gap-6 h-screen overflow-auto'>
            {!status && <Button variant='contained' onClick={() => setStatus(true)}>Create Group Chat</Button>}
            {status && <div className=' flex flex-col justify-center gap-4'>
                <input onChange={(e) => { setGroupName(e.target.value) }} value={groupName} type="text" placeholder="Group Name" className="input input-bordered input-primary w-full max-w-xs" />
                <div className=' flex justify-evenly'>
                    <Button variant='contained' onClick={createAGroupChat}>Create Chat</Button>
                    <Button onClick={() => setStatus(false)} variant='outlined' color='error' sx={{ color: 'white' }}>Cancel Creating</Button>
                </div>
            </div>}
            <div>
                <button className={`btn btn-ghost ${showUsers?' text-white':''}`} onClick={() => setShowUsers(true)}>Users</button>
                <button className={`btn btn-ghost ${!showUsers?' text-white':''}`} onClick={() => setShowUsers(false)}>Groups</button>
            </div>
            {showUsers && users && users.map((user) => (
                <div key={user._id} className="flex gap-2 items-center">
                    <div className="hover:cursor-pointer hover:translate-x-1 hover:translate-y-1 w-full" onClick={() => { navigate(`/chats/${user._id}`) }}>
                        <User user={user} />
                    </div>
                    {status && <input
                        type="checkbox"
                        className="checkbox bg-gray-500"
                        onChange={() => handleCheckboxChange(user._id)}
                        checked={selectedUserIds.includes(user._id)}
                    />}
                </div>
            ))}
            {
                !showUsers && <GroupList />
            }
        </div>
    );
};

export default SideBar;
