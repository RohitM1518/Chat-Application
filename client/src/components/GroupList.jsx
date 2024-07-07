import { useStepContext } from '@mui/material';
import React from 'react'
import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Group  from './Group';
import { useNavigate, useParams } from 'react-router-dom';
import { useChatContext } from '../context/ChatContext';
import { useMessageContext } from '../context/MessageContext';
import { useSidebarContext } from '../context/SidebarContext';
const GroupList = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const accessToken = useSelector(state => state?.user?.accessToken);
    const [groups,setGroups]=useState([])
    const navigate = useNavigate()
    const {groupid} = useParams()
    const {setChat} = useChatContext()
    const {setMessages} = useMessageContext()
    const {setIsSidebar}=useSidebarContext()
    useEffect(()=>{
        
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${backendUrl}/message/${groupid}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                // console.log("Chat Msg res",res.data.data)
                setMessages(res?.data?.data);
            } catch (error) {
                // console.log(error);
            }
        };
        if(groupid){
        fetchMessages();
        }
    },[groupid])
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${backendUrl}/chat/getgroupchats`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                // console.log(res.data.data)
                setGroups(res.data.data);
            } catch (error) {
                // console.log(error);
            }
        };
        fetchUsers();
    }, []);

    const handleClick=(group)=>{
        navigate(`/chats/group/${group._id}`) 
        // setIsSidebar(false)
        setChat(group)
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${backendUrl}/message/${group._id}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                // console.log("Chat Msg res",res.data.data)
                setMessages(res?.data?.data);
            } catch (error) {
                // console.log(error);
            }
        };
        fetchMessages();
    }
  return (
    <div>
        {groups &&
         groups.map((group)=>(
            <div key={group._id} className=" hover:cursor-pointer" onClick={()=>{handleClick(group)}}>
                <Group  group={group}/>
            </div>
         ))
        
        }
    </div>
  )
}

export default GroupList