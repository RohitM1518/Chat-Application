
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


//We can also use AuthLayout as a function name instead of Protected
export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector(state => state?.user?.authStatus)

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/signin")
    }

    setLoader(false)
  }, [authStatus, navigate, authentication])
  return loader ? <h1>Loading...</h1> : <>{children}
  </>
}
