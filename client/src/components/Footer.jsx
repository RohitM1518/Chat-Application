import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <div color="primary" className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
      <Toolbar className="flex flex-col md:flex-row justify-between items-center text-white p-4">
        <Typography variant="h6" className="text-center md:text-left mb-2 md:mb-0">
          &copy; 2024 ChatApp. All rights reserved.
        </Typography>
        {/* <div className="flex space-x-4">
          <IconButton color="inherit" href="https://facebook.com">
            <Facebook />
          </IconButton>
          <IconButton color="inherit" href="https://twitter.com">
            <Twitter />
          </IconButton>
          <IconButton color="inherit" href="https://instagram.com">
            <Instagram />
          </IconButton>
          <IconButton color="inherit" href="https://linkedin.com">
            <LinkedIn />
          </IconButton>
        </div> */}
      </Toolbar>
    </div>
  );
};

export default Footer;
