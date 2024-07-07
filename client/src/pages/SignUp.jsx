import React, { useState } from 'react';
import { TextField, Button, Avatar, Input } from '@mui/material';
import { styled } from '@mui/system';
import { errorParser } from '../utils/errorParser';
import { loginSuccess } from '../redux/userSlice';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';

const InputField = styled(TextField)({
  marginBottom: '1rem',
});

const SignUp = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    contactNo: '',
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    // Handle form submission
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullname);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('contactNo', formData.contactNo);
      formDataToSend.append('avatar', formData.avatar);
      // console.log(formData.avatar)
      const res = await axios.post(`${backendUrl}/user/register`, formDataToSend)
      // console.log(res.data.data.data)
      dispatch(loginSuccess(res.data.data.data))
      navigate('/')

    } catch (error) {
      // console.log(error)
      const errorMsg = errorParser(error)
      setError(errorMsg)
    }
    // console.log(formData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 p-4">
        <form onSubmit={handleSubmit} className=" backdrop-blur-2xl p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-black">Sign Up</h2>
          <h4 className=' text-center mb-2 text-red-600'>{error}</h4>
          <InputField
            label="Full Name"
            variant="outlined"
            fullWidth
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            sx={{ color: 'white' }}
          />
          <InputField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Password"
            variant="outlined"
            fullWidth
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <InputField
            label="Contact Number"
            variant="outlined"
            fullWidth
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
          />
          <div className="flex items-center space-x-4 mb-4">
            <Avatar
              src={formData.avatar ? URL.createObjectURL(formData.avatar) : 'https://via.placeholder.com/150'}
              alt="Avatar"
              className="w-16 h-16"
            />
            <Button variant="outlined" component="label">
              Upload Avatar
              <Input
                type="file"
                hidden
                onChange={handleAvatarChange}
                style={{ background: '' }}
                className='file-input file-input-ghost w-full max-w-xs'
              />
            </Button>
          </div>
          <Button type="submit" variant="contained" color="primary" fullWidth className="bg-blue-500 hover:bg-blue-700">
            Sign Up
          </Button>
        </form>
      </main>
    </div>
  );
};

export default SignUp;
