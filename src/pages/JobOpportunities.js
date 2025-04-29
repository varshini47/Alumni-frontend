// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useUser } from "../UserContext";
// import { FaTrash, FaBuilding, FaMapMarkerAlt, FaBriefcase, FaUserTie, FaTools, FaFileAlt, FaCalendar, FaLink, FaEnvelope, FaPlus, FaClock } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import nitc from "../assets/NIT-calicut-1024x576.webp";
// import { toast } from 'react-toastify';

// function JobOpportunities() {
//   const [jobs, setJobs] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     company: "",
//     location: "",
//     jobType: "",
//     experienceLevel: "",
//     skills: "",
//     description: "",
//     applicationDeadline: "",
//     applicationLink: "",
//     contactInfo: "",
//   });

//   const { user } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const response = await axios.get("https://alumni-back-yabh.onrender.com/api/jobs", { withCredentials: true });
//       const jobOppurtunitiesArray = Array.isArray(response.data) ? response.data.reverse() : [response.data];
//       setJobs(jobOppurtunitiesArray);
//     } catch (error) {
//       console.error("Error fetching job opportunities", error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       formData.userId = user.id;
//       await axios.post("https://alumni-back-yabh.onrender.com/api/jobs", formData, { withCredentials: true });
//       toast.success("Job posted successfully!");
//       setFormData({
//         title: "",
//         company: "",
//         location: "",
//         jobType: "",
//         experienceLevel: "",
//         skills: "",
//         description: "",
//         applicationDeadline: "",
//         applicationLink: "",
//         contactInfo: "",
//         userId: "",
//       });
//       setShowForm(false);
//       fetchJobs();
//     } catch (error) {
//       console.error("Error posting job", error);
//       toast.error("Failed to post job");
//     }
//   };

//   const handleDelete = async (jobId) => {
//     toast.info(
//       <div>
//         <p>Are you sure you want to delete this job?</p>
//         <div className="mt-2 flex justify-center space-x-3">
//           <button 
//             className="bg-red-500 text-white px-3 py-1 rounded"
//             onClick={() => {
//               toast.dismiss();
//               performDelete(jobId);
//             }}
//           >
//             Yes, Delete
//           </button>
//           <button 
//             className="bg-gray-500 text-white px-3 py-1 rounded"
//             onClick={() => toast.dismiss()}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>,
//       {
//         autoClose: false,
//         closeOnClick: false,
//         draggable: false,
//         closeButton: false
//       }
//     );
//   };

//   const performDelete = async (jobId) => {
//     try {
//       await axios.delete(`https://alumni-back-yabh.onrender.com/api/jobs/${jobId}`, { withCredentials: true });
//       setJobs(jobs.filter((job) => job.id !== jobId));
//       toast.success("Job deleted successfully");
//     } catch (error) {
//       console.error("Error deleting job", error);
//       toast.error("Failed to delete job");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 relative">
//       {/* Header Section with title - only shown when form is hidden */}
//       {!showForm && (
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
//             Job Opportunities
//           </h2>
//         </div>
//       )}

//       {/* Button to show form - changes to only show when form is not already visible */}
//       {user && user.firstName && !showForm && (
//         <button
//           onClick={() => setShowForm(true)}
//           className="fixed top-45 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg z-10 flex items-center gap-2"
//         >
//           <FaPlus className="mr-1" /> Post Job
//         </button>
//       )}

//       {/* Form overlay - only visible when showForm is true */}
//       {showForm && user && user.firstName && (
//         <div className="relative min-h-screen flex items-center justify-start bg-gray-100">
//           {/* Blurred Background Image */}
//           <div className="absolute inset-0 bg-cover bg-center" 
//                style={{ backgroundImage: `url(${nitc})`, filter: "blur(2px)" }}></div>
//           <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
          
//           {/* Form Container */}
//           <div className="relative bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-3xl border border-gray-300 ml-[100px]">
//             {/* Close button */}
//             <button 
//               onClick={() => setShowForm(false)}
//               className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition z-10"
//               aria-label="Close form"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
            
//             <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
//               Post a Job
//             </h2>
            
//             <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
//               {/* Job Title */}
//               <div className="relative">
//                 <FaBriefcase className="absolute left-3 top-3 text-blue-500" />
//                 <span className="absolute right-2 top-1 text-red-500 text-lg">*</span>
//                 <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} className="w-full pl-10 p-2 border rounded hover:shadow-md transition" required />
//               </div>
        
//               {/* Company Name */}
//               <div className="relative">
//                 <FaBuilding className="absolute left-3 top-3 text-green-500" />
//                 <span className="absolute right-2 top-1 text-red-500 text-lg">*</span>
//                 <input name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} className="w-full pl-10 p-2 border rounded hover:shadow-md transition" required />
//               </div>
        
//               {/* Location */}
//               <div className="relative">
//                 <FaMapMarkerAlt className="absolute left-3 top-3 text-red-500" />
//                 <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full pl-10 p-2 border rounded hover:shadow-md transition" />
//               </div>
        
//               {/* Job Type */}
//               <div className="relative">
//                 <FaClock className="absolute left-3 top-3 text-indigo-500" />
//                 <span className="absolute right-2 top-1 text-red-500 text-lg">*</span>
//                 <input name="jobType" placeholder="Job Type" value={formData.jobType} onChange={handleChange} className="w-full pl-10 p-2 border rounded hover:shadow-md transition" required />
//               </div>
        
//               {/* Experience Level */}
//               <div className="relative">
//                 <FaUserTie className="absolute left-3 top-3 text-yellow-500" />
//                 <input name="experienceLevel" placeholder="Experience Level" value={formData.experienceLevel} onChange={handleChange} className="w-full pl-10 p-2 border rounded hover:shadow-md transition" />
//               </div>
        
//               {/* Skills Required */}
//               <div className="relative">
//                 <FaTools className="absolute left-3 top-3 text-blue-500" />
//                 <span className="absolute right-2 top-1 text-red-500 text-lg">*</span>
//                 <input name="skills" placeholder="Skills Required" value={formData.skills} onChange={handleChange} className="w-full pl-10 p-2 border rounded hover:shadow-md transition" required />
//               </div>
        
//               {/* Application Deadline */}
//               <div className="relative">
//                 <FaCalendar className="absolute left-3 top-3 text-teal-500" />
                
//                 <input
//                   name="applicationDeadline"
//                   type="date"
//                   value={formData.applicationDeadline}
//                   onChange={handleChange}
//                   min={new Date().toISOString().split("T")[0]} // Restricts past dates
//                   className="w-full pl-10 p-2 border rounded hover:shadow-md transition"
//                   required
//                 />
//               </div>
        
//               {/* Application Link */}
//               <div className="relative">
//                 <FaLink className="absolute left-3 top-3 text-gray-500" />
//                 <span className="absolute right-2 top-1 text-red-500 text-lg">*</span>
//                 <input name="applicationLink" placeholder="Application Link" value={formData.applicationLink} onChange={handleChange} className="w-full pl-10 p-2 border rounded hover:shadow-md transition" required />
//               </div>
        
//               {/* Contact Info */}
//               <div className="relative">
//                 <FaEnvelope className="absolute left-3 top-3 text-yellow-500" />
//                 <input name="contactInfo" placeholder="Contact Info" value={formData.contactInfo} onChange={handleChange} className="w-full pl-10 p-2 border rounded hover:shadow-md transition" />
//               </div>
        
//               {/* Job Description (Full Width) */}
//               <div className="relative col-span-2">
//                 <FaFileAlt className="absolute left-3 top-3 text-gray-500" />
//                 <textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleChange} className="w-full pl-10 p-2 border rounded hover:shadow-md transition h-28" />
//               </div>
        
//               {/* Submit Button (Full Width) */}
//               <div className="col-span-2">
//                 <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition shadow-md">
//                   Post Job
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Job Cards */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//         {jobs.length > 0 ? (
//           jobs.map((job) => (
//             <div key={job.id} className="bg-white p-5 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 relative group">
//               <div className="flex justify-between">
//                 <h3 className="text-xl font-semibold text-gray-900 flex items-center">
//                   {job.title}
//                 </h3>
//                 {user && user.role === "admin" && (
//                   <button
//                     onClick={() => handleDelete(job.id)}
//                     className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
//                   >
//                     <FaTrash size={16} />
//                   </button>
//                 )}
//               </div>
//               <p className="text-gray-600 flex items-center">
//                 <FaBuilding className="text-green-500 mr-2" /> {job.company}
//               </p>
//               <p className="text-gray-600 flex items-center">
//                 <FaMapMarkerAlt className="text-red-500 mr-2" /> {job.location}
//               </p>
//               <p className="text-gray-500 flex items-center">
//                 <FaUserTie className="text-yellow-500 mr-2" /> {job.experienceLevel}
//               </p>
//               <p className="text-gray-500 flex items-center">
//                 <FaTools className="text-blue-500 mr-2" /> {job.skills}
//               </p>
//               <p className="mt-2 text-sm text-gray-700">{job.description}</p>
//               <p className="text-gray-500 flex items-center">
//                 <FaClock className="text-indigo-500 mr-2" /> Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
//               </p>
//               <div className="mt-4 flex justify-between items-center">
//                 <a href={job.applicationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
//                   🔗 Apply Now
//                 </a>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No job opportunities posted yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default JobOpportunities;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../UserContext";
import { 
  FaTrash, FaBuilding, FaMapMarkerAlt, FaBriefcase, FaUserTie, 
  FaTools, FaFileAlt, FaCalendar, FaLink, FaEnvelope, FaPlus, 
  FaClock, FaTimes, FaExternalLinkAlt, FaFilter, FaSearch,
  FaInfoCircle, FaCheckCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import nitc from "../assets/NIT-calicut-1024x576.webp";
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";

function JobOpportunities() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    skills: "",
    description: "",
    applicationDeadline: "",
    applicationLink: "",
    contactInfo: "",
  });

  const { user } = useUser();
  const navigate = useNavigate();
  
  const jobTypes = [
    "Full-time", 
    "Part-time", 
    "Contract", 
    "Internship", 
    "Remote", 
    "Hybrid",
    "Freelance"
  ];
  
  const experienceLevels = [
    "Entry Level",
    "Junior",
    "Mid-Level",
    "Senior",
    "Lead",
    "Manager",
    "Director",
    "Executive"
  ];

  useEffect(() => {
    fetchJobs();
  }, []);
  
  useEffect(() => {
    let result = jobs;
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(lowercasedSearch) ||
        job.company.toLowerCase().includes(lowercasedSearch) ||
        job.skills.toLowerCase().includes(lowercasedSearch) ||
        job.description.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Apply job type filter
    if (filterType) {
      result = result.filter(job => 
        job.jobType.toLowerCase() === filterType.toLowerCase()
      );
    }
    
    setFilteredJobs(result);
  }, [jobs, searchTerm, filterType]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("https://alumni-back-yabh.onrender.com/api/jobs", { withCredentials: true });
      const jobOpportunitiesArray = Array.isArray(response.data) ? response.data.reverse() : [response.data];
      setJobs(jobOpportunitiesArray);
      setFilteredJobs(jobOpportunitiesArray);
    } catch (error) {
      console.error("Error fetching job opportunities", error);
      toast.error("Failed to load job opportunities");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
    
    setFormData({ ...formData, [name]: value });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = "Job title is required";
    if (!formData.company.trim()) errors.company = "Company name is required";
    if (!formData.jobType.trim()) errors.jobType = "Job type is required";
    if (!formData.skills.trim()) errors.skills = "Skills are required";
    if (!formData.applicationDeadline) errors.applicationDeadline = "Application deadline is required";
    if (!formData.applicationLink.trim()) errors.applicationLink = "Application link is required";
    
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
      formData.userId = user.id;
      await axios.post("https://alumni-back-yabh.onrender.com/api/jobs", formData, { withCredentials: true });
      toast.success("Job posted successfully!");
      setFormData({
        title: "",
        company: "",
        location: "",
        jobType: "",
        experienceLevel: "",
        skills: "",
        description: "",
        applicationDeadline: "",
        applicationLink: "",
        contactInfo: "",
      });
      setShowForm(false);
      fetchJobs();
    } catch (error) {
      console.error("Error posting job", error);
      toast.error("Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (jobId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this job?</p>
        <div className="mt-2 flex justify-center space-x-3">
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => {
              toast.dismiss();
              performDelete(jobId);
            }}
          >
            Yes, Delete
          </button>
          <button 
            className="bg-gray-500 text-white px-3 py-1 rounded"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false
      }
    );
  };

  const performDelete = async (jobId) => {
    try {
      await axios.delete(`https://alumni-back-yabh.onrender.com/api/jobs/${jobId}`, { withCredentials: true });
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job", error);
      toast.error("Failed to delete job");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
              Job Opportunities
            </h1>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              Discover career opportunities shared by fellow alumni and industry partners
            </p>
          </motion.div>
        )}

        {/* Search and Filter */}
        {!showForm && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 bg-white p-4 rounded-xl shadow-md"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search jobs by title, company, or skills..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <FaFilter className="absolute left-3 top-3 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition"
                  >
                    <option value="">All Job Types</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {(searchTerm || filterType) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                  >
                    <FaTimes className="mr-2" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Post Job Button */}
        {user && user.firstName && !showForm && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => setShowForm(true)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-4 rounded-full shadow-lg z-10 flex items-center gap-2 hover:from-blue-500 hover:to-indigo-700 transition-all"
          >
            <FaPlus className="text-lg" /> 
            <span className="hidden md:inline">Post Job</span>
          </motion.button>
        )}

        {/* Job Posting Form */}
        <AnimatePresence>
          {showForm && user && user.firstName && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
              
              {/* Form Card */}
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden"
              >
                {/* Form Header */}
                <div className="bg-gradient-to-r from-blue-400 to-indigo-600 p-6 text-white">
                  <h2 className="text-2xl font-bold text-center">
                    Post a Job Opportunity
                  </h2>
                  <p className="text-center text-blue-100 mt-1">
                    Share career opportunities with the alumni community
                  </p>
                </div>
                
                {/* Close button */}
                <button 
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20 transition z-20"
                  aria-label="Close form"
                >
                  <FaTimes size={24} />
                </button>
                
                {/* Form Content */}
                <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Job Title */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaBriefcase className="absolute left-3 top-3 text-blue-500" />
                          <input 
                            name="title" 
                            placeholder="e.g., Senior Software Engineer" 
                            value={formData.title} 
                            onChange={handleChange} 
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                              formErrors.title ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {formErrors.title && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                        )}
                      </div>
                      
                      {/* Company Name */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Company <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaBuilding className="absolute left-3 top-3 text-blue-500" />
                          <input 
                            name="company" 
                            placeholder="e.g., Google, Microsoft" 
                            value={formData.company} 
                            onChange={handleChange} 
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                              formErrors.company ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {formErrors.company && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.company}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Job Type */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Job Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaClock className="absolute left-3 top-3 text-blue-500" />
                          <select 
                            name="jobType" 
                            value={formData.jobType} 
                            onChange={handleChange} 
                            className={`w-full p-3 pl-10 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 transition ${
                              formErrors.jobType ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">Select Job Type</option>
                            {jobTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        {formErrors.jobType && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.jobType}</p>
                        )}
                      </div>
                      
                      {/* Location */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 top-3 text-blue-500" />
                          <input 
                            name="location" 
                            placeholder="e.g., New York, Remote" 
                            value={formData.location} 
                            onChange={handleChange} 
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Experience Level */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Experience Level
                        </label>
                        <div className="relative">
                          <FaUserTie className="absolute left-3 top-3 text-blue-500" />
                          <select 
                            name="experienceLevel" 
                            value={formData.experienceLevel} 
                            onChange={handleChange} 
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 transition"
                          >
                            <option value="">Select Experience Level</option>
                            {experienceLevels.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {/* Application Deadline */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Application Deadline <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaCalendar className="absolute left-3 top-3 text-blue-500" />
                          <input
                            name="applicationDeadline"
                            type="date"
                            value={formData.applicationDeadline}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                              formErrors.applicationDeadline ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {formErrors.applicationDeadline && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.applicationDeadline}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Skills Required */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Skills Required <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaTools className="absolute left-3 top-3 text-blue-500" />
                          <input 
                            name="skills" 
                            placeholder="e.g., React, Node.js, SQL" 
                            value={formData.skills} 
                            onChange={handleChange} 
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                              formErrors.skills ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {formErrors.skills && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.skills}</p>
                        )}
                      </div>
                      
                      {/* Application Link */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Application Link <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaLink className="absolute left-3 top-3 text-blue-500" />
                          <input 
                            name="applicationLink" 
                            placeholder="https://example.com/apply" 
                            value={formData.applicationLink} 
                            onChange={handleChange} 
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                              formErrors.applicationLink ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {formErrors.applicationLink && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.applicationLink}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Information
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3 text-blue-500" />
                        <input 
                          name="contactInfo" 
                          placeholder="e.g., Email or LinkedIn profile" 
                          value={formData.contactInfo} 
                          onChange={handleChange} 
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                    </div>
                    
                    {/* Job Description */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Job Description
                      </label>
                      <div className="relative">
                        <FaFileAlt className="absolute left-3 top-3 text-blue-500" />
                        <textarea 
                          name="description" 
                          placeholder="Describe the role, responsibilities, and requirements..." 
                          value={formData.description} 
                          onChange={handleChange} 
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                          rows="4"
                        />
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                          <span>Posting...</span>
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          <span>Post Job</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job Listings */}
        {!showForm && (
          <div className="mt-8">
            {filteredJobs.length > 0 ? (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-600">
                    Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                    {searchTerm && ` for "${searchTerm}"`}
                    {filterType && ` in ${filterType}`}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all relative group overflow-hidden"
                    >
                      {/* Job type badge */}
                      <div className="absolute top-0 right-0">
                        <div className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-bl-lg">
                          {job.jobType}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        {/* Admin delete button */}
                        {user && user.role === "admin" && (
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="absolute top-5 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                        
                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-1 pr-16">
                            {job.title}
                          </h3>
                          <div className="flex items-center text-gray-700">
                            <FaBuilding className="text-blue-500 mr-2" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                        </div>
                        
                        {/* Details */}
                        <div className="space-y-2 mb-4">
                          {job.location && (
                            <div className="flex items-start">
                              <FaMapMarkerAlt className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                              <span className="text-gray-600">{job.location}</span>
                            </div>
                          )}
                          
                          {job.experienceLevel && (
                            <div className="flex items-start">
                              <FaUserTie className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                              <span className="text-gray-600">{job.experienceLevel}</span>
                            </div>
                          )}
                          
                          <div className="flex items-start">
                            <FaTools className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <span className="text-gray-600 font-medium">Skills: </span>
                              <span className="text-gray-600">{job.skills}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FaClock className="text-indigo-500 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <span className="text-gray-600">Apply by: </span>
                              <span className="text-gray-700 font-medium">
                                {new Date(job.applicationDeadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Description preview */}
                        {job.description && (
                          <div className="mb-4">
                            <div className="text-gray-700 text-sm line-clamp-3">
                              {job.description}
                            </div>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                          <a
                            href={job.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                          >
                            <FaExternalLinkAlt size={14} />
                            <span>Apply Now</span>
                          </a>
                          
                          {job.contactInfo && (
                            <div className="flex items-center text-gray-600 text-sm">
                              <FaInfoCircle className="mr-1" />
                              <span>Contact: {job.contactInfo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) :   (            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-10 rounded-xl shadow-md text-center"
              >
                <FaBriefcase className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No job opportunities found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterType ? 
                    "Try adjusting your search filters or check back later for new opportunities." : 
                    "There are no job opportunities posted yet. Be the first to share an opportunity with the alumni community."}
                </p>
                {user && user.firstName && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg inline-flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition"
                  >
                    <FaPlus />
                    <span>Post a Job</span>
                  </button>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobOpportunities;

