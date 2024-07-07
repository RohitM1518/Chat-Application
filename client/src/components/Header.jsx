import React, { useState } from 'react';
import { Toolbar, IconButton, Typography, Avatar, Button } from '@mui/material';
import { Notifications, Settings } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';
import axios from 'axios';
import { useSidebarContext } from '../context/SidebarContext';
import { GiHamburgerMenu } from "react-icons/gi";
import { useResponseContext } from '../context/ResponseContext';
import { useLoadingContext } from '../context/LoadingContext';
import { useErrorContext } from '../context/ErrorContext';
import { errorParser } from '../utils/errorParser';
import { persistor } from '../redux/store';

const Header = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const location = useLocation()
    // console.log("Location ",location)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const accessToken = useSelector(state => state?.user?.accessToken);
    const isLogin = useSelector(state => state?.user?.authStatus);
    const user = useSelector(state => state.user.currentUser);
    // console.log(user)
    // console.log(isLogin)
    // console.log(accessToken)
    const { isSidebar, setIsSidebar }= useSidebarContext()
    const {setIsLoading}= useLoadingContext()
    const {setResponse}=useResponseContext()
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    const handleLogout = async () => {
        try {
            setIsLoading(true)
            await axios.get(`${backendUrl}/user/logout`, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            dispatch(logout());
            navigate('/');
            setResponse("Logged Out")
        } catch (error) {
            // setError(errorParser(error))
            // console.log("Error in logout", error);
            persistor.purge();
            setResponse("Logged Out")
        }
        finally{
            setIsLoading(false)
        }
    };

    return (
        <div className={`flex items-center justify-between bg-gradient-to-r from-cyan-600 via-purple-500 to-pink-500 z-10 ${isSidebar?" max-lg:hidden":""}`}>
            {!isSidebar && user && location.pathname != '/' &&<div className='p-2 hover:cursor-pointer' onClick={()=>setIsSidebar(true)}>
                  <GiHamburgerMenu style={{ width: 25, height: 25,color:'white' }}/>
                </div>}
            {isLogin && (
                    <div className="relative flex items-center gap-4 ml-4 max-sm:hidden">
                        <Avatar alt={user?.fullName} src={user?.avatar} sx={{ width: 50, height: 50 }} />
                        <h5 className=' text-white text-lg font-semibold'>{user?.fullName}</h5>
                    </div>
                )}
            {isLogin && location.pathname=='/' && screenSize.width<= 640 && (
                    <div className="relative flex items-center gap-4 ml-4">
                        <Avatar alt={user?.fullName} src={user?.avatar} sx={{ width: 50, height: 50 }} />
                        {/* <h5 className=' text-white text-lg font-semibold'>{user?.fullName}</h5> */}
                    </div>
                )}
            <Toolbar className="w-full flex items-center">
                <div className="flex-1 flex justify-center hover:cursor-pointer"  onClick={()=>navigate('/')}>
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
