import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from '../UserContext';  // Import the UserContext to use loginUser
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify';

const GoogleLoginButton = () => {
  const [error, setError] = useState("");  // For handling any error
  const navigate = useNavigate();
  const { loginUser } = useUser(); // Access the loginUser function from UserContext

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info using Google token
        const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const { email, given_name, family_name } = userInfoResponse.data;
        console.log(email, given_name);

        // Send user info to your Spring Boot backend
        const backendResponse = await axios.post(
          "https://alumni-back-yabh.onrender.com/api/google-login",
          { email, firstName: given_name, lastName: family_name },
          { withCredentials: true }
        );

        if (backendResponse.data.newUser === true) {
          // New user: navigate to the registration page.
          toast.error("Not registered yet. Moving to registration page.");
          navigate("/register");
        } else {
          // User exists: store user in context and navigate to the alumni dashboard.
          const { user } = backendResponse.data; // Retrieve the user data from the response
          loginUser({
            email: user.email,
            firstName: user.name,
            lastName: user.lastName,
            role: user.role, // Assuming backend returns user role
            imageUrl: user.imageUrl,
            batch: user.batch,
            rollNo: user.rollNo,
            department: user.department,
            id: user.id,
            profileType: user.profileType,
            phone: user.phone,
          });
          
          // Show success toast
          toast.success(`Welcome back, ${user.name}! Login successful.`);
          navigate("/");
        }
      } catch (error) {
        console.error("Google login failed:", error);
        setError("An error occurred during Google login. Please try again.");
        toast.error("Google login failed. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      setError("Login failed. Please try again.");
      toast.error("Google login failed. Please try again.");
    },
  });

  return (
    <div>
      <button
        onClick={googleLogin}
        className="w-full flex items-center justify-center bg-red-400 text-white p-2 rounded hover:bg-red-600 mt-2"
      >
        <FcGoogle className="text-xl mr-2" /> Sign in with Google
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error message if any */}
    </div>
  );
};

export default GoogleLoginButton;
