import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify';

function GoogleRegister() {
  const navigate = useNavigate();

  // Before redirecting to Google OAuth
  const googleLogin = () => {
    // Store that we're in the process of Google registration
    localStorage.setItem('googleRegistrationStarted', 'true');
    window.location.href = 'https://alumni-back-yabh.onrender.com/oauth2/authorization/google';
  };

  // The backend should redirect to your app after OAuth process
  // Your main App component or a dedicated callback component should 
  // check if 'googleRegistrationStarted' is in localStorage on mount
  // and if so, show toast and clear the flag
  
  useEffect(() => {
    const registrationStarted = localStorage.getItem('googleRegistrationStarted');
    
    if (registrationStarted) {
      toast.success("Google registration successful!");
      localStorage.removeItem('googleRegistrationStarted');
    }
  }, []);

  return (
    <button
      onClick={() => googleLogin()}
      className="w-full flex items-center justify-center bg-red-400 text-white p-2 rounded hover:bg-red-600 mt-2"
    >
      <FcGoogle className="text-xl mr-2" /> Register with Google
    </button>
  );
}

export default GoogleRegister;
