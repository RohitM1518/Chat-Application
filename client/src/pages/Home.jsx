import React from 'react';
import { Button } from '@mui/material';
import { Chat, PersonAdd } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate()
    const isLogin = useSelector(state => state?.user?.authStatus)
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center bg-gradient-to-r from-cyan-600 via-pink-400 to-red-700 text-white">
        <h1 className="text-5xl font-bold mb-4 text-center">Welcome to ChatApp</h1>
        <p className="text-xl mb-8">Connect with your friends and family instantly</p>
        <div className="flex space-x-4">
          {isLogin && <Button
            variant="contained"
            color="primary"
            startIcon={<Chat />}
            className="bg-purple-700 hover:bg-purple-800"
            onClick={()=>navigate("/chats")}
          >
            Start Chatting
          </Button>}
         {!isLogin && <Button
            variant="contained"
            color="secondary"
            startIcon={<PersonAdd />}
            className="bg-green-600 hover:bg-green-700"
            onClick={()=>navigate("/signup")}
          >
            Sign Up To Chat
          </Button>}
        </div>
      </main>
          </div>
  );
};

export default Home;
