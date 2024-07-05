import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { errorParser } from '../utils/errorParser';
import { useDispatch } from 'react-redux';
import {loginSuccess} from '../redux/userSlice.js'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const SignIn = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [error,setError]=useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('')
    // Handle form submission
    try {
        const res = await axios.post(`${backendUrl}/user/login`, formData)
            console.log(res.data.data.data)
            dispatch(loginSuccess(res.data.data.data))
            navigate('/')
    } catch (error) {
        const errorMsg = errorParser(error)
        setError(errorMsg)
    }
    console.log(formData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center  bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300  p-4">
        <form onSubmit={handleSubmit} className=" flex flex-col gap-9 backdrop-blur-xl p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-black">Sign In</h2>
          <h4 className=' text-center text-red-600'>{error}</h4>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mb-4"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="mb-4"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="bg-blue-500 hover:bg-blue-700 text-white"
          >
            Sign In
          </Button>
        </form>
      </main>
    </div>
  );
};

export default SignIn;
