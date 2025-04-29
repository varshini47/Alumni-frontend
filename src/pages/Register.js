// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
// import GoogleRegister from "../loginComponents/GoogleRegister";
// import uploadToCloudinary from "../cloudinaryupload";
// import nitcImage from "../assets/NIT-calicut-1024x576.webp";
// import { FaUser, FaEnvelope, FaLock, FaPhone, FaGraduationCap, FaIdBadge, FaUniversity } from "react-icons/fa";
// import { toast } from 'react-toastify';

// function Register() {
//   const [name, setName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [batch, setBatch] = useState("");
//   const [rollNo, setRollNo] = useState("");
//   const [department, setDepartment] = useState("");
//   const [role, setRole] = useState("ALUMNI");
//   const [profileType, setProfileType] = useState("PUBLIC");
//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = (e) => setImage(e.target.files[0]);
//   let defaulturl = `https://res.cloudinary.com/dcsomu9n6/image/upload/v1742667126/qkeb6zjwjoyygy4w51bz.webp`;

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     // Phone validation (10 digits)
//     if (!/^\d{10}$/.test(phone)) {
//       toast.error("Phone number must be exactly 10 digits.");
//       return;
//     }

//     // Batch validation (4-digit year)
//     if (!/^\d{4}$/.test(batch)) {
//       toast.error("Batch must be a 4-digit year.");
//       return;
//     }

//     setUploading(true);
//     let uploadedImageUrl;
//     try {
//       if (image) {
//         uploadedImageUrl = await uploadToCloudinary(image);
//       } else {
//         uploadedImageUrl = defaulturl;
//       }
      
//       setUploading(false);

//       const userData = { name, lastName, email, password, role, profileType, phone, batch, rollNo, department, imageUrl: uploadedImageUrl };

//       await axios.post("http://localhost:8080/api/register", userData, { withCredentials: true });
//       toast.success("Registration successful!");
//       navigate("/login");
//     } catch (error) {
//       setUploading(false);
//       toast.error(error.response ? error.response.data : "Registration failed! Try again.");
//     }
//   };

//   // Add a new function to handle profile type changes
//   const handleProfileTypeChange = (type) => {
//     if (type === "PRIVATE") {
//       toast.info(
//         "Note: Even with a private profile, administrators can still view your complete profile information.",
//         {
//           autoClose: 5000,
//           position: "top-center"
//         }
//       );
//     }
//     setProfileType(type);
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-start p-6 relative bg-cover bg-center"
//       style={{ backgroundImage: `url(${nitcImage})` }}
//     >
//       {/* Blurred overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
  
//       {/* Form container shifted to the left */}
//       <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200 z-10 ml-[250px]">
        
//       <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>
  
//   <form onSubmit={handleSubmit} className="space-y-4">
//     <div className="flex space-x-4">
//       <div className="relative w-1/2">
//         <FaUser className="absolute left-3 top-3 text-gray-500" />
//         <input type="text" placeholder="First Name" value={name} onChange={(e) => setName(e.target.value)}
//           className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" required />
//         <span className="absolute right-3 top-1 text-red-500">*</span>
//       </div>
//       <div className="relative w-1/2">
//         <FaUser className="absolute left-3 top-3 text-gray-500" />
//         <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}
//           className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" required />
//         <span className="absolute right-3 top-1 text-red-500">*</span>
//       </div>
//     </div>

//     <div className="relative">
//       <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
//       <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
//         className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" required />
//       <span className="absolute right-3 top-1 text-red-500">*</span>
//     </div>

//     <div className="relative">
//       <FaLock className="absolute left-3 top-3 text-gray-500" />
//       <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
//         className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" required />
//       <span className="absolute right-3 top-1 text-red-500">*</span>
//     </div>

//     <div className="flex space-x-4">
//       <div className="relative w-1/2">
//         <FaPhone className="absolute left-3 top-3 text-gray-500" />
//         <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)}
//           className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" required />
//         <span className="absolute right-3 top-1 text-red-500">*</span>
//       </div>
//       <div className="relative w-1/2">
//         <FaGraduationCap className="absolute left-3 top-3 text-gray-500" />
//         <input type="text" placeholder="Batch (e.g., 2025)" value={batch} onChange={(e) => setBatch(e.target.value)}
//           className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" required />
//         <span className="absolute right-3 top-1 text-red-500">*</span>
//       </div>
//     </div>

//     <div className="flex space-x-4">
//       <div className="relative w-1/2">
//         <FaIdBadge className="absolute left-3 top-3 text-gray-500" />
//         <input type="text" placeholder="Roll Number" value={rollNo} onChange={(e) => setRollNo(e.target.value)}
//           className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" />
//       </div>
//       <div className="relative w-1/2">
//         <FaUniversity className="absolute left-3 top-3 text-gray-500" />
//         <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)}
//           className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" required />
//         <span className="absolute right-3 top-1 text-red-500">*</span>
//       </div>
//     </div>

//     <input type="file" className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" onChange={handleFileChange} />

//     {/* Profile Type Selection */}
//     <div>
//       <label className="block text-gray-700 font-semibold">Profile Type:</label>
//       <div className="flex space-x-4">
//         <label className="flex items-center">
//           <input 
//             type="radio" 
//             value="PUBLIC" 
//             checked={profileType === "PUBLIC"} 
//             onChange={() => handleProfileTypeChange("PUBLIC")} 
//             className="mr-2" 
//           />
//           Public
//         </label>
//         <label className="flex items-center">
//           <input 
//             type="radio" 
//             value="PRIVATE" 
//             checked={profileType === "PRIVATE"} 
//             onChange={() => handleProfileTypeChange("PRIVATE")} 
//             className="mr-2" 
//           />
//           Private
//         </label>
//       </div>
//     </div>

//     <button 
//       type="submit" 
//       disabled={uploading}
//       className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg text-lg font-bold shadow-md hover:scale-105 transition-transform duration-200 ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
//     >
//       {uploading ? "Uploading..." : "Register"}
//     </button>
//   </form>

//   <div className="mt-4 text-gray-500 text-center">OR</div>
  
//         <div className="flex flex-col items-center space-y-2 mt-4">
//           <GoogleRegister />
//         </div>
//       </div>
//     </div>
//   );  
// }  
// export default Register;

import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import GoogleRegister from "../loginComponents/GoogleRegister";
import uploadToCloudinary from "../cloudinaryupload";
import nitcImage from "../assets/NIT-calicut-1024x576.webp";
import { 
  FaUser, FaEnvelope, FaLock, FaPhone, FaGraduationCap, 
  FaIdBadge, FaUniversity, FaUpload, FaUserCheck, FaUserShield, 
  FaCheckCircle, FaTimesCircle, FaArrowRight, FaArrowLeft,
  FaCamera, FaSignInAlt
} from "react-icons/fa";
import { toast } from 'react-toastify';
import { motion } from "framer-motion";

function Register() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [batch, setBatch] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("ALUMNI");
  const [profileType, setProfileType] = useState("PUBLIC");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // For multi-step form
  
  const navigate = useNavigate();

  const departmentOptions = [
    "Computer Science and Engineering",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering", 
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "Architecture",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Other"
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  // Clean up image preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);
  
  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!name.trim()) newErrors.name = "First name is required";
      if (!lastName.trim()) newErrors.lastName = "Last name is required";
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
      
      if (!password.trim()) {
        newErrors.password = "Password is required";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    } else if (currentStep === 2) {
      if (!/^\d{10}$/.test(phone)) {
        newErrors.phone = "Phone number must be exactly 10 digits";
      }
      
      if (!/^\d{4}$/.test(batch)) {
        newErrors.batch = "Batch must be a 4-digit year";
      }
      
      if (!department.trim()) newErrors.department = "Department is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) {
      return;
    }
    
    setUploading(true);
    let uploadedImageUrl;
    
    try {
      if (image) {
        uploadedImageUrl = await uploadToCloudinary(image);
      } else {
        uploadedImageUrl = `https://res.cloudinary.com/dcsomu9n6/image/upload/v1742667126/qkeb6zjwjoyygy4w51bz.webp`;
      }
      
      const userData = { 
        name, 
        lastName, 
        email, 
        password, 
        role, 
        profileType, 
        phone, 
        batch, 
        rollNo, 
        department, 
        imageUrl: uploadedImageUrl 
      };

      await axios.post("http://localhost:8080/api/register", userData, { withCredentials: true });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response ? error.response.data : "Registration failed! Try again.");
    } finally {
      setUploading(false);
    }
  };

  // Function to handle profile type changes
  const handleProfileTypeChange = (type) => {
    if (type === "PRIVATE") {
      toast.info(
        "Note: Even with a private profile, administrators can still view your complete profile information.",
        {
          autoClose: 5000,
          position: "top-center"
        }
      );
    }
    setProfileType(type);
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Step 1: Account Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-blue-500" />
                  <input
                    type="text"
                    placeholder="Your first name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-blue-500" />
                  <input
                    type="text"
                    placeholder="Your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-blue-500" />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-blue-500" />
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters long
              </p>
            </div>
            
            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-blue-500" />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* Step 2: Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3 text-blue-500" />
                  <input
                    type="text"
                    placeholder="10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              
              {/* Batch */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Batch Year <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaGraduationCap className="absolute left-3 top-3 text-blue-500" />
                  <input
                    type="text"
                    placeholder="e.g., 2025"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.batch ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.batch && (
                  <p className="text-red-500 text-xs mt-1">{errors.batch}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Roll Number */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Roll Number
                </label>
                <div className="relative">
                  <FaIdBadge className="absolute left-3 top-3 text-blue-500" />
                  <input
                    type="text"
                    placeholder="Your roll number"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
              
              {/* Department */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUniversity className="absolute left-3 top-3 text-blue-500" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.department ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                {errors.department && (
                  <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                )}
              </div>
            </div>
            
            {/* Profile Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Profile Visibility
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  profileType === "PUBLIC" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 hover:border-blue-300"
                }`}>
                  <input
                    type="radio"
                    checked={profileType === "PUBLIC"}
                    onChange={() => handleProfileTypeChange("PUBLIC")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <FaUserCheck className="text-blue-500 mr-2" />
                      <span className="font-medium">Public</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Your profile is visible to everyone
                    </p>
                  </div>
                </label>
                
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  profileType === "PRIVATE" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 hover:border-blue-300"
                }`}>
                  <input
                    type="radio"
                    checked={profileType === "PRIVATE"}
                    onChange={() => handleProfileTypeChange("PRIVATE")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <FaUserShield className="text-blue-500 mr-2" />
                      <span className="font-medium">Private</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Limited visibility to other alumni
                    </p>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Profile Image */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden relative">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FaCamera className="text-gray-400 text-3xl" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Upload your photo</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Progress bar */}
          <div className="bg-gradient-to-r from-blue-400 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-bold text-center mb-4">Create Your Alumni Account</h2>
            
            <div className="flex items-center justify-center max-w-md mx-auto">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
              } font-bold text-lg`}>
                1
              </div>
              <div className={`flex-1 h-1 ${
                step >= 2 ? 'bg-white' : 'bg-blue-400'
              }`}></div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
              } font-bold text-lg`}>
                2
              </div>
            </div>
            
            <div className="text-center mt-2">
              <p className="text-blue-100">
                {step === 1 ? "Account Information" : "Personal Details"}
              </p>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <form onSubmit={(e) => e.preventDefault()}>
              {renderStepContent()}
              
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 transition"
                  >
                    <FaArrowLeft />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div></div> // Empty div to maintain flex layout
                )}
                
                {step < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white py-2 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-700 transition"
                  >
                    <span>Continue</span>
                    <FaArrowRight />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white py-2 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-700 transition disabled:opacity-70"
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        <span>Complete Registration</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-500">Already have an account?</span>
                <Link 
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  <FaSignInAlt className="mr-1" />
                  <span>Sign in</span>
                </Link>
              </div>
              
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or register with</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <GoogleRegister />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;