// import { useState } from "react";
// import { useUser } from "../UserContext"; // Import UserContext
// import nitc from "../assets/NIT-calicut-1024x576.webp";
// import axios from "axios"; // Import Axios
// import { useNavigate } from "react-router-dom";
// import uploadToCloudinary from "../cloudinaryupload";
// import { toast } from "react-toastify"; 
// import { FaTrophy, FaCalendarAlt, FaTag, FaFileAlt, FaBuilding, FaPaperPlane, FaUser } from "react-icons/fa";

// const AchievementsForm = () => {
//   const { user } = useUser(); // Get logged-in user details
//   const [uploading, setUploading] = useState(false);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: "",
//     dateOfAchievement: "",
//     category: "",
//     description: "",
//     supportingDocuments: null,
//     organization: "",
//     userId: user.id,
//   });

//   const handleChange = async (e) => {
//     if (e.target.name === "supportingDocuments") {
//       setUploading(true);
//       const uploadedImageUrl = await uploadToCloudinary(e.target.files[0]);
//       setUploading(false);
//       setFormData({ ...formData, supportingDocuments: uploadedImageUrl });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Submitting Achievement:", formData);

//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/achievements",
//         formData,
//         { withCredentials: true }
//       );
//       console.log("Response:", response.data);
    
//       toast.success("Achievement Added Successfully!");

//       if(user.role === "ALUMNI"){
//       navigate(`/profile/${user.id}`);}
//       else
//       navigate("/admin-dashboard");
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Failed to Add Achievement");
  
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-start bg-cover bg-center relative"
//       style={{ backgroundImage: `url(${nitc})` }}
//     >
//       {/* Overlay for blur effect */}
//       <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
  
//       {/* Form Container - Moved to left side */}
//       <div className="relative bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-lg border border-gray-300 ml-[250px]">
//         {/* Close button with conditional navigation */}
//         <button 
//           onClick={() => {
//             if (user.role === "admin") {
//               navigate("/achievements"); // Admin goes to admin dashboard
//             } else {
//               navigate(`/profile/${user.id}`); // Alumni goes to their profile page
//             }
//           }}
//           className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition z-10"
//           aria-label="Cancel and return"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//           </svg>
//         </button>
  
//         <h2 className="text-3xl font-bold text-center text-gray-900 mb-6 flex items-center justify-center">
//           Add Achievement
//         </h2>
  
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Achievement Title */}
//           <div className="relative">
//             <FaTrophy className="absolute left-3 top-3 text-gray-500" />
//             <span className="absolute top-1 right-2 text-red-500">*</span>
//             <input
//               type="text"
//               name="title"
//               placeholder="Achievement Title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
//               required
//             />
//           </div>
  
//           {/* Date of Achievement */}
//           <div className="relative">
//             <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
           
//             <input
//               type="date"
//               name="dateOfAchievement"
//               value={formData.dateOfAchievement}
//               onChange={handleChange}
//               max={new Date().toISOString().split("T")[0]} // Restrict future dates
//               className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
//               required
//             />
//           </div>
  
//           {/* Category */}
//           <div className="relative">
            
//             <FaTag className="absolute left-3 top-3 text-gray-500" />
//             <span className="absolute top-1 right-2 text-red-500">*</span>

//             <input
//               type="text"
//               name="category"
//               placeholder="Category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
//               required
//             />
//           </div>
  
//           {/* Description */}
//           <div className="relative">
//             <FaFileAlt className="absolute left-3 top-3 text-gray-500" />
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
//               rows="4"
//             ></textarea>
//           </div>
  
//           {/* Supporting Documents */}
//           <div className="relative">
//             <FaFileAlt className="absolute left-3 top-3 text-gray-500" />
//             <input
//               type="file"
//               name="supportingDocuments"
//               onChange={handleChange}
//               className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
//             />
//           </div>
  
//           {/* Recognizing Organization */}
//           <div className="relative">
//             <FaBuilding className="absolute left-3 top-3 text-gray-500" />
//             <input
//               type="text"
//               name="organization"
//               placeholder="Recognizing Organization"
//               value={formData.organization}
//               onChange={handleChange}
//               className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
//             />
//           </div>
  
//           {user.role === "admin" && (
//             <div className="relative">
//               <FaUser className="absolute left-3 top-3 text-gray-500" />
//               <input
//                 type="text"
//                 name="achievedBy"
//                 placeholder="Achieved By"
//                 value={formData.achievedBy}
//                 onChange={handleChange}
//                 className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
//                 required
//               />
//             </div>
//           )}
  
//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg text-lg font-bold shadow-md flex items-center justify-center gap-2 transition-all duration-300 hover:bg-opacity-90"
//           >
//             {uploading ? "Uploading..." : "Add Achievement"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }  
// export default AchievementsForm;



import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import nitc from "../assets/NIT-calicut-1024x576.webp";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import uploadToCloudinary from "../cloudinaryupload";
import { toast } from "react-toastify";
import { 
  FaTrophy, FaCalendarAlt, FaTag, FaFileAlt, FaBuilding, 
  FaPaperPlane, FaUser, FaTimesCircle, FaAward, FaArrowLeft,
  FaCloudUploadAlt, FaCertificate, FaMedal
} from "react-icons/fa";
import { motion } from "framer-motion";

const AchievementsForm = () => {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    dateOfAchievement: "",
    category: "",
    description: "",
    supportingDocuments: null,
    organization: "",
    userId: user.id,
  });

  const categoryOptions = [
    { value: "Award", label: "Award", icon: <FaTrophy className="text-yellow-500" /> },
    { value: "Certification", label: "Certification", icon: <FaCertificate className="text-blue-500" /> },
    { value: "Recognition", label: "Recognition", icon: <FaMedal className="text-purple-500" /> },
    { value: "Publication", label: "Publication", icon: <FaFileAlt className="text-green-500" /> },
    { value: "Other", label: "Other", icon: <FaAward className="text-gray-500" /> }
  ];

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
    
    if (name === "supportingDocuments") {
      if (files && files[0]) {
        // Create preview URL
        const previewUrl = URL.createObjectURL(files[0]);
        setImagePreview(previewUrl);
        
        setUploading(true);
        try {
          const uploadedImageUrl = await uploadToCloudinary(files[0]);
          setFormData({ ...formData, supportingDocuments: uploadedImageUrl });
        } catch (error) {
          toast.error("Failed to upload image. Please try again.");
          console.error("Upload error:", error);
        } finally {
          setUploading(false);
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.dateOfAchievement) errors.dateOfAchievement = "Date is required";
    if (!formData.category) errors.category = "Category is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await axios.post(
        "http://localhost:8080/api/achievements",
        formData,
        { withCredentials: true }
      );
      
      toast.success("Achievement Added Successfully!");

      if (user.role === "ALUMNI") {
        navigate(`/profile/${user.id}`);
      } else {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to Add Achievement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (user.role === "admin") {
      navigate("/achievements");
    } else {
      navigate(`/profile/${user.id}`);
    }
  };

  // Clean up image preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page header with navigation */}
        <div className="mb-6">
          <Link 
            to={user.role === "admin" ? "/achievements" : `/profile/${user.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            <FaArrowLeft className="mr-2" /> 
            <span>Back to {user.role === "admin" ? "Achievements" : "Profile"}</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaAward className="text-blue-600" />
            <span>Add New Achievement</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Showcase your accomplishments, certifications, and recognitions
          </p>
        </div>
      
        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Card header */}
          <div className="bg-gradient-to-r from-blue-400 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-bold">Achievement Details</h2>
            <p className="text-indigo-100">Fill in the information about your achievement</p>
          </div>
          
          {/* Form and image preview in two columns */}
          <div className="p-6 md:p-8 grid md:grid-cols-5 gap-8">
            {/* Form column - takes 3/5 of space */}
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Achievement Title */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Achievement Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaTrophy className="absolute left-3 top-3 text-blue-400" />
                    <input
                      type="text"
                      name="title"
                      placeholder="E.g., Best Paper Award, Professional Certification"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400 transition ${
                        formErrors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formErrors.title && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                  )}
                </div>
                
                {/* Category & Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaTag className="absolute left-3 top-3 text-blue-400" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full p-3 pl-10 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 transition ${
                          formErrors.category ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Category</option>
                        {categoryOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formErrors.category && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
                    )}
                  </div>
                  
                  {/* Date of Achievement */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Date Achieved <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-3 text-blue-400" />
                      <input
                        type="date"
                        name="dateOfAchievement"
                        value={formData.dateOfAchievement}
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]}
                        className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400 transition ${
                          formErrors.dateOfAchievement ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {formErrors.dateOfAchievement && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.dateOfAchievement}</p>
                    )}
                  </div>
                </div>
                
                {/* Recognizing Organization */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Issuing Organization
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-3 text-blue-400" />
                    <input
                      type="text"
                      name="organization"
                      placeholder="E.g., IEEE, Microsoft, University of Cambridge"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                </div>
                
                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="relative">
                    <FaFileAlt className="absolute left-3 top-3 text-blue-400" />
                    <textarea
                      name="description"
                      placeholder="Describe the achievement, its significance, and what skills or knowledge it represents..."
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                
                {/* Admin-only field */}
                {user.role === "admin" && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Achieved By <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-blue-400" />
                      <input
                        type="text"
                        name="achievedBy"
                        placeholder="Enter alumni name"
                        value={formData.achievedBy}
                        onChange={handleChange}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                      />
                    </div>
                  </div>
                )}
                
                {/* Form action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="flex-1 bg-gradient-to-r from-blue-400 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-700 transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Save Achievement</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                  >
                    <FaTimesCircle />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
            
            {/* Image upload/preview column - takes 2/5 of space */}
            <div className="md:col-span-2">
              <div className="space-y-1 mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Supporting Document
                </label>
                <p className="text-xs text-gray-500">Upload a certificate, award image, or relevant document</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-64 flex flex-col items-center justify-center relative bg-gray-50">
                {imagePreview ? (
                  <>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-full max-w-full object-contain" 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({...formData, supportingDocuments: null});
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    >
                      <FaTimesCircle />
                    </button>
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-500 mb-4">Drag and drop or click to upload</p>
                    {uploading && (
                      <div className="mt-2">
                        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-400 rounded-full animate-spin mx-auto"></div>
                        <p className="text-sm text-indigo-600 mt-2">Uploading...</p>
                      </div>
                    )}
                  </>
                )}
                
                <input
                  type="file"
                  name="supportingDocuments"
                  onChange={handleChange}
                  className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${imagePreview ? 'hidden' : ''}`}
                  accept="image/*,.pdf"
                  disabled={uploading}
                />
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPEG, PNG, PDF. Max size: 5MB
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AchievementsForm;