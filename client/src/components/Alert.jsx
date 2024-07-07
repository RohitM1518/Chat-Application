import React, { useState } from 'react';
import { useAlertContext } from '../context/AlertContext';
import { useChatContext } from '../context/ChatContext';
import { useMessageContext } from '../context/MessageContext';
import { useNavigate } from 'react-router-dom';
import { useResponseContext } from '../context/ResponseContext';
import { useSelector } from 'react-redux';
import { useLoadingContext } from '../context/LoadingContext';
import { useErrorContext } from '../context/ErrorContext';
import { errorParser } from '../utils/errorParser';
import axios from 'axios';

const Alert = ({ message,url}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const {setAlert}=useAlertContext()
  const {chat,setChat}=useChatContext()
  const {setMessages}=useMessageContext()
  const navigate = useNavigate()
  const {setResponse}=useResponseContext()
  const {setError}=useErrorContext()
  const accessToken = useSelector(state => state?.user?.accessToken);
  const {setIsLoading}=useLoadingContext()
  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`${url}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      setChat(null)
      setMessages([])
      navigate('/chats')
      setResponse("Participant removed successfully")
    } catch (error) {
      // console.log(error)
      setError(errorParser(error))
    }
    finally{
      setIsLoading(false)
    }
  }
  return (
    <div role="alert" className="alert my-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>{message}</span>
      <div className=' flex gap-3'>
        <button className=' bg-red-500 px-2 rounded-lg text-black font-semibold' onClick={handleDelete}>Continue</button>
        <button className="btn btn-sm btn-primary" onClick={()=>setAlert(false)}>Close</button>
      </div>
    </div>
  );
};

export default Alert;
