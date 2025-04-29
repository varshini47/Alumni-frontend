// import React, { useEffect, useState, useRef } from "react";
// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { FaBriefcase, FaAward, FaUserEdit } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import { useUser } from "../UserContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// function Profile() {
//   const { user, fetchUserData, logoutUser } = useUser();
//   const navigate = useNavigate();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [alumni, setAlumni] = useState(null);
//   const [profileType, setProfileType] = useState(user?.profileType || "PUBLIC");
//   const [workexp, setWorkExp] = useState([]);
//   const [achievements, setAchievements] = useState([]);
//   const [points, setPoints] = useState(null);
//   const userId = user?.id;
//   const [loading, setLoading] = useState(false);
  
//   const dropdownRef = useRef(null);
//   const { id } = useParams();

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   // All useEffects MUST be placed here before any conditional returns
  
//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     // Only fetch user data if we're logged in
//     if (user && user.firstName) {
//       const fetchUser = async () => {
//         setLoading(true);
//         try {
//           const response = await axios.get(`http://localhost:8080/api/users/${id}`, { withCredentials: true });
//           setAlumni(response.data);
//           setProfileType(response.data.profileType);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           toast.error("Failed to load user profile");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchUser();
//     }
//   }, [id, user]);

//   useEffect(() => {
//     // Only fetch points if we're logged in
//     if (user && user.firstName) {
//       const fetchPoints = async () => {
//         try {
//           const response = await axios.get(`http://localhost:8080/api/users/${id}/points`, { withCredentials: true });
//           setPoints(response.data.points);
//         } catch (error) {
//           console.error("Error fetching points:", error);
//           setPoints(0);
//         }
//       };
//       fetchPoints();
//     }
//   }, [id, user]);

//   useEffect(() => {
//     // Only fetch work experience if we're logged in
//     if (user && user.firstName) {
//       const fetchWorkExp = async () => {
//         try {
//           const response = await fetch(`http://localhost:8080/api/work-experience/user/${id}`, { withCredentials: true });
//           if (!response.ok) {
//             throw new Error("Failed to fetch work experience");
//           }
//           const data = await response.json();
//           const workExpArray = Array.isArray(data) ? data.reverse() : [data];
//           setWorkExp(workExpArray);
//         } catch (error) {
//           console.error("Error fetching work experience:", error);
//           setWorkExp([]);
//         }
//       };
//       fetchWorkExp();
//     }
//   }, [id, user]);

//   useEffect(() => {
//     // Only fetch achievements if we're logged in
//     if (user && user.firstName) {
//       const fetchAchievements = async () => {
//         try {
//           const response = await fetch(`http://localhost:8080/api/achievements/user/${id}`, { withCredentials: true });
//           if (!response.ok) {
//             throw new Error("Failed to fetch achievement");
//           }
//           const data = await response.json();
//           const achievementsArray = Array.isArray(data) ? data.reverse() : [data];
//           setAchievements(achievementsArray);
//         } catch (error) {
//           console.error("Error fetching achievements:", error);
//           setAchievements([]);
//         }
//       };
//       fetchAchievements();
//     }
//   }, [id, user]);

//   const handleProfileTypeChange = async (newType) => {
//     setProfileType(newType);
//     try {
//       await axios.put(
//         `http://localhost:8080/api/users/${id}/updateProfile`,
//         { profileType: newType },
//         { withCredentials: true }
//       );
//       await fetchUserData(user.id);
      
//       // Show a single notification based on profile type change
//       if (newType === "PRIVATE") {
//         toast.info(
//           "Profile set to private. Note: Administrators can still view your complete profile information.", 
//           {
//             autoClose: 5000,
//             position: "top-center"
//           }
//         );
//       } else {
//         toast.success("Profile set to public. Your profile is now visible to all users.");
//       }
//     } catch (error) {
//       console.error("Error updating profile type:", error);
//       toast.error("Failed to update profile visibility. Please try again.");
//     }
//   };

//   // Now we can have conditional returns safely
  
//   // Check if user is logged in first
//   if (!user || !user.firstName) {
//     return (
//       <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 font-inter">
//         <div className="container mx-auto flex items-center justify-center py-24">
//           <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
//             <p className="text-gray-600 mb-6">You need to be logged in to view profiles.</p>
//             <div className="flex justify-center gap-4">
//               <button 
//                 onClick={() => navigate("/login")} 
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
//               >
//                 Log In
//               </button>
//               <button 
//                 onClick={() => navigate("/")} 
//                 className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 transition"
//               >
//                 Go Home
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (loading) return <div className="text-center p-6 text-gray-700">Loading...</div>;
//   if (!alumni) return <div className="text-center p-6 text-gray-700">User not found</div>;

//   return user.role === "ALUMNI" && alumni && alumni.profileType === "PRIVATE" && userId != id ? (
//     <div className="p-6 min-h-[calc(100vh-200px)] text-center text-gray-700">
//       <h2 className="text-2xl font-bold">{alumni.name} {alumni.lastName}'s profile is private.</h2>
//     </div>
//   ) : (
//     <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 font-inter">
//       {/* Profile Card */}
//       <div className="container mx-auto flex flex-col md:flex-row py-12 gap-8 px-4">
//         <motion.div
//           className="md:w-1/3 h-[530px] bg-white p-8 rounded-lg shadow-lg border border-gray-200 relative overflow-hidden flex flex-col items-center text-center"
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-300 to-indigo-500 rounded-t-lg"></div>
//           <div className="relative mt-16">
//             {alumni.imageUrl ? (
//               <img
//                 src={alumni.imageUrl}
//                 alt="User"
//                 className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md hover:scale-105 transition transform duration-300"
//               />
//             ) : (
//               <div className="h-32 w-32 rounded-full bg-gray-400 flex items-center justify-center border-4 border-white shadow-md">
//                 No Photo
//               </div>
//             )}
//           </div>
//           <div className="mt-6">
//             <h2 className="text-2xl font-bold text-gray-800">{alumni.name} {alumni.lastName}</h2>
//             <p className="text-lg text-gray-600">Batch: {alumni.batch}</p>
//             <p className="text-lg text-gray-600">Department: {alumni.department}</p>
//             <p className="text-lg text-gray-700 mt-2">Points Earned: {points !== null ? points : "Loading..."}</p>
//             {userId == id && (
//               <div>
//               <div className="mt-4">
//                 <label className="text-lg font-semibold">Profile Type:</label>
//                 <select
//                   value={profileType}
//                   onChange={(e) => handleProfileTypeChange(e.target.value)}
//                   className="ml-2 px-4 py-2 border rounded-md text-gray-700"
//                 >
//                   <option value="PUBLIC">Public</option>
//                   <option value="PRIVATE">Private</option>
//                 </select>
//               </div>
//               <div className="mt-6">
//               <button
//                 onClick={() => navigate("/update-profile")}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
//               >
//                 Edit Profile
//               </button>
//             </div>
//               </div>
//             )}
            
//           </div>
//         </motion.div>

//         {/* Work Experience & Achievements */}
//         <div className="md:w-2/3 space-y-6">
//           <motion.div
//             className="bg-white p-8 rounded-lg shadow-lg"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold flex items-center gap-2 text-indigo-700">
//                 <FaBriefcase /> Work Experience
//               </h3>
//               <Link to={`/alumni/${id}/workexperience`} className="text-indigo-600 hover:underline">View All</Link>
//             </div>
//             <div className="mt-4 space-y-4">
//               {workexp && workexp.length > 0 ? (
//                 workexp.slice(0, 2).map((exp, index) => (
//                   <div key={index} className="p-4 bg-gray-50 rounded-lg shadow">
//                     <h4 className="text-lg font-semibold">{exp.role}</h4>
//                     <p className="text-gray-700 font-medium">{exp.company} • {new Date(exp.startDate).toLocaleDateString()} - {exp.present?"Present":new Date(exp.endDate).toLocaleDateString()}</p>
//                     <p className="text-gray-600">{exp.description}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500">No work experience available</p>
//               )}
//             </div>
//           </motion.div>

//           <motion.div
//             className="bg-white p-8 rounded-lg shadow-lg"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold flex items-center gap-2 text-indigo-700">
//                 <FaAward /> Achievements
//               </h3>
//               <Link to={`/alumni/${id}/achievements`} className="text-indigo-600 hover:underline">View All</Link>
//             </div>
//             <div className="mt-4 space-y-4">
//               {achievements && achievements.length > 0 ? (
//                 achievements.slice(0, 2).map((exp, index) => (
//                   <div key={index} className="p-4 bg-gray-50 rounded-lg shadow">
//                     <h4 className="text-lg font-semibold">{exp.title} <span className="bg-gray-200 text-gray-700 px-2 py-1 text-sm rounded">{exp.organization}</span></h4>
//                     <p className="text-gray-700">{new Date(exp.dateOfAchievement).toLocaleDateString()}</p>
//                     <p className="text-gray-600">{exp.description}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500">No Achievements available</p>
//               )}
//             </div>
//           </motion.div>

//           <motion.div>
//             {userId == id && (
//               <div className="container mx-auto pb-8 flex justify-end" ref={dropdownRef}>
//                 <button onClick={toggleDropdown} className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
//                   Add Details
//                 </button>
//                 {showDropdown && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
//                     <button onClick={() => { setShowDropdown(false); navigate("/add-work-experience"); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Work Experience</button>
//                     <button onClick={() => { setShowDropdown(false); navigate("/add-achievements"); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Achievements</button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;


import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaBriefcase, FaAward, FaUserEdit, FaMapMarkerAlt, FaGraduationCap, FaBuilding, FaCalendarAlt, FaPlus, FaLock, FaLockOpen, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../UserContext";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const { user, fetchUserData, logoutUser } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [alumni, setAlumni] = useState(null);
  const [profileType, setProfileType] = useState(user?.profileType || "PUBLIC");
  const [workexp, setWorkExp] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [points, setPoints] = useState(null);
  const userId = user?.id;
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef(null);
  const { id } = useParams();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // All useEffects MUST be placed here before any conditional returns
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Only fetch user data if we're logged in
    if (user && user.firstName) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8080/api/users/${id}`, { withCredentials: true });
          setAlumni(response.data);
          setProfileType(response.data.profileType);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load user profile");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, user]);

  useEffect(() => {
    // Only fetch points if we're logged in
    if (user && user.firstName) {
      const fetchPoints = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/users/${id}/points`, { withCredentials: true });
          setPoints(response.data.points);
        } catch (error) {
          console.error("Error fetching points:", error);
          setPoints(0);
        }
      };
      fetchPoints();
    }
  }, [id, user]);

  useEffect(() => {
    // Only fetch work experience if we're logged in
    if (user && user.firstName) {
      const fetchWorkExp = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/work-experience/user/${id}`, { withCredentials: true });
          if (!response.ok) {
            throw new Error("Failed to fetch work experience");
          }
          const data = await response.json();
          const workExpArray = Array.isArray(data) ? data.reverse() : [data];
          setWorkExp(workExpArray);
        } catch (error) {
          console.error("Error fetching work experience:", error);
          setWorkExp([]);
        }
      };
      fetchWorkExp();
    }
  }, [id, user]);

  useEffect(() => {
    // Only fetch achievements if we're logged in
    if (user && user.firstName) {
      const fetchAchievements = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/achievements/user/${id}`, { withCredentials: true });
          if (!response.ok) {
            throw new Error("Failed to fetch achievement");
          }
          const data = await response.json();
          const achievementsArray = Array.isArray(data) ? data.reverse() : [data];
          setAchievements(achievementsArray);
        } catch (error) {
          console.error("Error fetching achievements:", error);
          setAchievements([]);
        }
      };
      fetchAchievements();
    }
  }, [id, user]);

  const handleProfileTypeChange = async (newType) => {
    setProfileType(newType);
    try {
      await axios.put(
        `http://localhost:8080/api/users/${id}/updateProfile`,
        { profileType: newType },
        { withCredentials: true }
      );
      await fetchUserData(user.id);
      
      // Show a single notification based on profile type change
      if (newType === "PRIVATE") {
        toast.info(
          "Profile set to private. Note: Administrators can still view your complete profile information.", 
          {
            autoClose: 5000,
            position: "top-center"
          }
        );
      } else {
        toast.success("Profile set to public. Your profile is now visible to all users.");
      }
    } catch (error) {
      console.error("Error updating profile type:", error);
      toast.error("Failed to update profile visibility. Please try again.");
    }
  };

  // Now we can have conditional returns safely
  
  // Check if user is logged in first
  if (!user || !user.firstName) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h2 className="text-2xl font-bold">Authentication Required</h2>
            <p className="mt-2 text-blue-100">Access to alumni profiles requires login</p>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">Please sign in to your account to view alumni profiles and connect with the community.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate("/login")} 
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition flex items-center justify-center"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate("/")} 
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-blue-700 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (!alumni) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl text-gray-300 mb-4">404</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The alumni profile you're looking for doesn't exist or may have been removed.</p>
          <button 
            onClick={() => navigate("/")} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Private profile view
  if (user.role === "ALUMNI" && alumni && alumni.profileType === "PRIVATE" && userId != id) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full text-center">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-8 text-white">
            <div className="mx-auto w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FaLock className="text-3xl text-gray-200" />
            </div>
            <h2 className="text-2xl font-bold">Private Profile</h2>
          </div>
          <div className="p-8">
            <p className="text-xl font-semibold text-gray-800 mb-2">{alumni.name} {alumni.lastName}</p>
            <p className="text-gray-600 mb-6">This alumni has set their profile to private.</p>
            <button 
              onClick={() => navigate("/")} 
              className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              {/* Cover Image & Profile Picture */}
              <div className="h-32 bg-gradient-to-br from-blue-300 to-indigo-500 relative">
                {/* Profile Picture */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                    {alumni.imageUrl ? (
                      <img
                        src={alumni.imageUrl}
                        alt={alumni.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <FaUserEdit size={40} />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Profile Type Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`text-xs font-medium px-3 py-1 rounded-full flex items-center ${
                    profileType === "PRIVATE" 
                      ? "bg-gray-800 text-white" 
                      : "bg-green-600 text-white"
                  }`}>
                    {profileType === "PRIVATE" ? (
                      <><FaLock className="mr-1" /> Private</>
                    ) : (
                      <><FaLockOpen className="mr-1" /> Public</>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="pt-20 pb-8 px-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">{alumni.name} {alumni.lastName}</h1>
                  
                  <div className="mt-2 flex items-center justify-center space-x-1 text-gray-500">
                    <FaGraduationCap />
                    <span>{alumni.batch || "Batch not specified"}</span>
                  </div>
                  
                  <div className="mt-1 flex items-center justify-center space-x-1 text-gray-500">
                    <FaBuilding />
                    <span>{alumni.department || "Department not specified"}</span>
                  </div>
                </div>
                
                {/* Points Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Points Earned</span>
                    <div className="bg-blue-500 text-white text-lg font-bold w-12 h-12 rounded-full flex items-center justify-center">
                      {points !== null ? points : "..."}
                    </div>
                  </div>
                </div>
                
                {/* Current User Controls */}
                {userId == id && (
                  <div className="space-y-4">
                    {/* Profile Type Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Profile Visibility</span>
                      <div 
                        onClick={() => handleProfileTypeChange(profileType === "PUBLIC" ? "PRIVATE" : "PUBLIC")}
                        className={`relative w-12 h-6 transition-colors duration-300 rounded-full cursor-pointer ${
                          profileType === "PUBLIC" ? "bg-green-500" : "bg-gray-400" 
                        }`}
                      >
                        <span 
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300 transform bg-white ${
                            profileType === "PUBLIC" ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </div>
                    </div>
                    
                    {/* Edit Profile Button */}
                    <button
                      onClick={() => navigate("/update-profile")}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg shadow-sm transition-colors duration-300"
                    >
                      <FaEdit />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Work Experience & Achievements */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Work Experience */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaBriefcase className="text-blue-600 mr-2" /> 
                  <span>Work Experience</span>
                </h2>
                <Link 
                  to={`/alumni/${id}/workexperience`} 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                >
                  View All
                </Link>
              </div>
              
              <div className="p-6">
                {workexp && workexp.length > 0 ? (
                  <div className="space-y-6">
                    {workexp.slice(0, 2).map((exp, index) => (
                      <div key={index} className="group p-4 bg-gray-50 rounded-lg shadow">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 mt-1 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <FaBriefcase />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">{exp.role}</h3>
                            <p className="text-gray-600 font-medium">{exp.company}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FaCalendarAlt className="mr-1" />
                              <span>
                                {new Date(exp.startDate).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short'
                                })} - {exp.present ? "Present" : new Date(exp.endDate).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short'
                                })}
                              </span>
                            </div>
                            <p className="mt-2 text-gray-600">{exp.description}</p>
                          </div>
                        </div>
                        {index < workexp.slice(0, 2).length - 1 && <hr className="my-4 border-gray-100" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                      <FaBriefcase size={24} />
                    </div>
                    <p className="text-gray-500">No work experience available</p>
                    {userId == id && (
                      <button 
                        onClick={() => navigate("/add-work-experience")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                      >
                        Add Work Experience
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaAward className="text-blue-600 mr-2" /> 
                  <span>Achievements</span>
                </h2>
                <Link 
                  to={`/alumni/${id}/achievements`} 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                >
                  View All
                </Link>
              </div>
              
              <div className="p-6">
                {achievements && achievements.length > 0 ? (
                  <div className="space-y-6">
                    {achievements.slice(0, 2).map((achievement, index) => (
                      <div key={index} className="group p-4 bg-gray-50 rounded-lg shadow">
                        <div className="flex items-start space-x-4">
                        {/* className="p-4 bg-gray-50 rounded-lg shadow" */}
                          <div className="w-10 h-10 mt-1 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                            <FaAward />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">{achievement.title}</h3>
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                {achievement.organization}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FaCalendarAlt className="mr-1" />
                              <span>
                                {new Date(achievement.dateOfAchievement).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className="mt-2 text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        {index < achievements.slice(0, 2).length - 1 && <hr className="my-4 border-gray-100" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                      <FaAward size={24} />
                    </div>
                    <p className="text-gray-500">No achievements available</p>
                    {userId == id && (
                      <button 
                        onClick={() => navigate("/add-achievements")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                      >
                        Add Achievement
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Add Details Button (Only for own profile) */}
            {userId == id && (workexp.length > 0 || achievements.length > 0) && (
              <div className="flex justify-end" ref={dropdownRef}>
                <div className="relative">
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-300"
                  >
                    <FaPlus />
                    <span>Add Details</span>
                  </button>
                  
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10"
                      >
                        <button 
                          onClick={() => { setShowDropdown(false); navigate("/add-work-experience"); }}
                          className="flex items-center space-x-2 w-full text-left px-4 py-3 hover:bg-blue-50 transition"
                        >
                          <FaBriefcase className="text-blue-600" />
                          <span>Work Experience</span>
                        </button>
                        <button 
                          onClick={() => { setShowDropdown(false); navigate("/add-achievements"); }}
                          className="flex items-center space-x-2 w-full text-left px-4 py-3 hover:bg-blue-50 transition"
                        >
                          <FaAward className="text-indigo-600" />
                          <span>Achievement</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile;