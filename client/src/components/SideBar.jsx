import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import User from './User';
import { useChatContext } from '../context/ChatContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { errorParser } from '../utils/errorParser';
import GroupList from './GroupList';
import { MdCancelPresentation } from "react-icons/md";
import { useSidebarContext } from '../context/SidebarContext';
import { useErrorContext } from '../context/ErrorContext';
import { useLoadingContext } from '../context/LoadingContext';
import { useResponseContext } from '../context/ResponseContext';
import ClosePNG from '../assets/close.png'

const SideBar = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
    const { isSidebar, setIsSidebar }= useSidebarContext()
    const {setError} = useErrorContext()
    const {setIsLoading}=useLoadingContext()
    const {setResponse}=useResponseContext()
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    // console.log("Screen size",screenSize)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${backendUrl}/chat/users`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setUsers(res.data.data);
            } catch (error) {
                // console.log(error);
                throw error
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const getChat = async () => {
            try {
                if (!id) return;
                const res = await axios.post(`${backendUrl}/chat/c/${id}`, { refreshToken }, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setChat(res.data.data);
            } catch (error) {
                // console.log(error);
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
    const selectUser=(user)=>{
        navigate(`/chats/${user._id}`) 
        if(screenSize.width>768){
            setIsSidebar(true)
            return
        }
        setIsSidebar(false)
    }
    const createAGroupChat = async () => {
        try {
            const payload = {
                participants: selectedUserIds,
                name: groupName
            }
            // console.log("payload", payload)
            setIsLoading(true)
            await axios.post(`${backendUrl}/chat/group`, payload, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            setStatus(false)
            setResponse("Group Created")
        } catch (error) {
            const errMsg = errorParser(error)
            console.log(errMsg)
            setError(errMsg)
        }
        finally{
            setIsLoading(false)
        }
    }

    return (
        <div className='bg-gradient-to-t from-rose-500 via-purple-500 to-cyan-600 relative py-10 px-2 w-96 z-10 flex flex-col gap-6  max-lg:w-full h-screen overflow-auto max-lg:px-7 '>
            {isSidebar && <div className='hover:cursor-pointer absolute right-5 top-2' onClick={() => setIsSidebar(false)}>
                {/* <MdCancelPresentation style={{width:25,height:25,color:'white'}}/> */}
                <img src={ClosePNG} alt="" width={18} height={20} className=''/>
            </div>}
            {!status && showUsers && <Button variant='contained' onClick={() => setStatus(true)}>Create Group Chat</Button>}
            {status && <div className=' flex flex-col justify-center gap-4'>
                <input onChange={(e) => { setGroupName(e.target.value) }} value={groupName} type="text" placeholder="Group Name" className="input input-bordered input-primary w-full max-w-xs" />
                <div className=' flex justify-evenly'>
                    <Button variant='contained' onClick={createAGroupChat}>Create Chat</Button>
                    <Button onClick={() => setStatus(false)} variant='outlined' color='error' sx={{ color: 'white' }}>Cancel Creating</Button>
                </div>
            </div>}
            <div>
                <button className={`btn btn-ghost ${showUsers ? ' text-white' : ''}`} onClick={() => setShowUsers(true)}>Users</button>
                <button className={`btn btn-ghost ${!showUsers ? ' text-white' : ''}`} onClick={() => setShowUsers(false)}>Groups</button>
            </div>
            {showUsers && users && users.map((user) => (
                <div key={user._id} className="flex gap-2 items-center">
                    <div className="hover:cursor-pointer w-full" onClick={()=>{selectUser(user)}}>
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
