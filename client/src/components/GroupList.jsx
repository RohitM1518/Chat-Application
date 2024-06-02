import { useStepContext } from '@mui/material';
import React from 'react'
import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Group  from './Group';
const GroupList = () => {
    const accessToken = useSelector(state => state?.user?.accessToken);
    const [groups,setGroups]=useState([])
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:8000/chat/getgroupchats", {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log(res.data.data)
                setGroups(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, []);

  return (
    <div>
        {groups &&
         groups.map((group)=>(
            <div key={group._id} className="">
                <Group  group={group}/>
            </div>
         ))
        
        }
    </div>
  )
}

export default GroupList