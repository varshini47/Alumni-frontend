// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useUser } from "../UserContext";
// import GoogleLoginButton from "../loginComponents/GoogleLogin";
// import nitcImage from "../assets/NIT-calicut-1024x576.webp"; // Ensure the image is placed in assets folder
// import { toast } from "react-toastify";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [resetMessage, setResetMessage] = useState("");
//   const [isForgotPassword, setIsForgotPassword] = useState(false);
//   const navigate = useNavigate();
//   const { loginUser } = useUser();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");
//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/login",
//         { email, password },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         const userData = response.data;
//         loginUser({
//           email: userData.email,
//           firstName: userData.name,
//           lastName: userData.lastName,
//           role: userData.role,
//           imageUrl: userData.imageUrl,
//           batch: userData.batch,
//           rollNo: userData.rollNo,
//           department: userData.department,
//           id: userData.id,
//           profileType: userData.profileType,
//           phone: userData.phone,
//         });
        
//         // Show success toast message
//         toast.success(`Welcome back, ${userData.name}!`);
        
//         if(userData.role=="ALUMNI"){
//            navigate("/"); 
//         } else {
//           navigate("/admin-dashboard");
//         }
//       }
//     } catch (error) {
//       setErrorMessage("Login failed! Invalid email or password.");
//       toast.error("Login failed! Invalid email or password.");
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!email.trim()) {
//       setResetMessage("Please enter a valid email.");
//       toast.warning("Please enter a valid email.");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/email/forgot-password",
//         { email },
//         { withCredentials: true }
//       );
//       setResetMessage(response.data);
//       toast.success("Reset link sent to your email!");
//     } catch (error) {
//       setResetMessage("Error: Unable to send reset email.");
//       toast.error("Unable to send reset email. Please try again.");
//     }
//   };

//   return (
//     <div 
//       className="min-h-screen flex items-center justify-start p-6 relative bg-cover bg-center" 
//       style={{ backgroundImage: `url(${nitcImage})` }}
//     >
//       {/* Blurred overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>

//       {/* Login Box - Moved to left side */}
//       <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-xl w-96 max-w-lg border border-gray-200 z-10 ml-[250px]">

//         {!isForgotPassword ? (
//           <>
//             <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Login</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
              

//               <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg text-lg font-bold shadow-md hover:scale-105 transition-transform duration-200">
//                 Login
//               </button>
//             </form>

//             <p
//               className="mt-2 text-blue-600 cursor-pointer text-center hover:underline"
//               onClick={() => setIsForgotPassword(true)}
//             >
//               Forgot Password?
//             </p>

//             <div className="mt-4 text-gray-500 text-center">OR</div>

//             {/* Google Login Button */}
//             <div className="mt-4 flex justify-center">
//               <GoogleLoginButton />
//             </div>
//           </>
//         ) : (
//           <>
//             <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Reset Password</h2>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <button onClick={handleForgotPassword} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg text-lg font-bold shadow-md hover:scale-105 transition-transform duration-200 mt-5">
//               Send Reset Link
//             </button>

          
//             <p
//               className="mt-2 text-blue-600 cursor-pointer text-center hover:underline"
//               onClick={() => setIsForgotPassword(false)}
//             >
//               Back to Login
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Login;


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../UserContext";
import GoogleLoginButton from "../loginComponents/GoogleLogin";
import nitcImage from "../assets/NIT-calicut-1024x576.webp";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const userData = response.data;
        loginUser({
          email: userData.email,
          firstName: userData.name,
          lastName: userData.lastName,
          role: userData.role,
          imageUrl: userData.imageUrl,
          batch: userData.batch,
          rollNo: userData.rollNo,
          department: userData.department,
          id: userData.id,
          profileType: userData.profileType,
          phone: userData.phone,
        });
        
        toast.success(`Welcome back, ${userData.name}!`);
        
        if(userData.role === "ALUMNI"){
           navigate("/"); 
        } else {
          navigate("/admin-dashboard");
        }
      }
    } catch (error) {
      setErrorMessage("Login failed! Invalid email or password.");
      toast.error("Login failed! Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setResetMessage("Please enter a valid email.");
      toast.warning("Please enter a valid email.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/forgot-password",
        { email },
        { withCredentials: true }
      );
      setResetMessage(response.data);
      toast.success("Reset link sent to your email!");
    } catch (error) {
      setResetMessage("Error: Unable to send reset email.");
      toast.error("Unable to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Header section */}
          <div className="bg-gradient-to-r from-blue-400 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-bold text-center">
              {!isForgotPassword ? "Welcome Back" : "Reset Your Password"}
            </h2>
            <p className="text-center text-blue-100 mt-1">
              {!isForgotPassword 
                ? "Login to your alumni account" 
                : "We'll send you a password reset link"}
            </p>
          </div>
          
          <div className="p-6 md:p-8">
            {!isForgotPassword ? (
              <>
                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {errorMessage}
                  </div>
                )}
              
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-blue-500" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <button 
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-xs text-blue-600 hover:text-blue-800 transition"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-blue-500" />
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        required
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-400 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-700 transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <FaSignInAlt />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <GoogleLoginButton />
                  </div>
                </div>
                
                <div className="mt-6 text-center text-sm">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                {resetMessage && (
                  <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg text-sm">
                    {resetMessage}
                  </div>
                )}
                
                <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }} className="space-y-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-blue-500" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                        required
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-400 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-700 transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        <span>Sending link...</span>
                      </>
                    ) : (
                      <>
                        <FaEnvelope />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsForgotPassword(false)}
                    className="text-blue-400 hover:text-blue-600 transition inline-flex items-center"
                  >
                    <FaArrowLeft className="mr-2" />
                    <span>Back to Login</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;