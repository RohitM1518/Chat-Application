import React, { useState } from 'react';
import { Toolbar, IconButton, Typography, Avatar, Badge, Button } from '@mui/material';
import { Notifications, Settings } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const accessToken = useSelector(state => state?.user?.accessToken);
    const isLogin = useSelector(state => state?.user?.authStatus);
    const user = useSelector(state => state.user.currentUser);
    console.log(user)
    console.log(isLogin)
    console.log(accessToken)

    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:8000/user/logout', {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.log("Error in logout", error);
        }
    };

    return (
        <div className="flex items-center justify-between bg-gradient-to-r from-cyan-600 via-purple-500 to-pink-500 z-10">
            {isLogin && (
                    <div className="relative flex items-center gap-4 ml-4 ">
                        <Avatar alt={user?.fullName} src={user?.avatar} sx={{ width: 50, height: 50 }} />
                        <h5 className=' text-white text-lg'>{user?.fullName}</h5>
                    </div>
                )}
            <Toolbar className="w-full flex items-center">
                <div className="flex-1 flex justify-center">
                    <h3 className="text-white font-bold text-2xl">ChatApp</h3>
                </div>
                
                <div className="flex items-center space-x-4">
                    {/* {isLogin && (
                        <>
                            <IconButton color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <Notifications />
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit">
                                <Settings />
                            </IconButton>
                        </>
                    )} */}
                    {!isLogin && (
                        <>
                            <Button
                                variant="outlined"
                                className="bg-blue-500 hover:bg-blue-700"
                                sx={{ color: 'white', borderWidth: '2px' }}
                                onClick={() => navigate("/signin")}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="contained"
                                className="bg-blue-500 hover:bg-blue-700"
                                sx={{ color: 'white' }}
                                onClick={() => navigate('/signup')}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                    {isLogin && (
                        <Button
                            variant="outlined"
                            className="bg-blue-500 hover:bg-blue-700"
                            sx={{ color: 'white' }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    )}
                </div>
            </Toolbar>
        </div>
    );
};

export default Header;
