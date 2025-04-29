import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBuilding, FaUserTie, FaMapMarkerAlt, FaCalendarAlt, FaTrash, FaUser, FaBriefcase, FaSearch, FaFilter, FaTimes, FaChevronRight } from "react-icons/fa";
import { useUser } from "../UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify"; 

const WorkExperienceList = () => {
    const [workExperiences, setWorkExperiences] = useState([]);
    const [filteredExperiences, setFilteredExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCompany, setFilterCompany] = useState("");
    const [companies, setCompanies] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    const { user } = useUser();

    useEffect(() => {
        fetchWorkExperiences();
    }, []);

    useEffect(() => {
        if (workExperiences.length > 0) {
            // Extract unique companies for filtering
            const uniqueCompanies = [...new Set(workExperiences.map(exp => exp.company))];
            setCompanies(uniqueCompanies.sort());
            
            // Apply filters
            let filtered = [...workExperiences];
            
            if (searchTerm) {
                const lowercaseSearch = searchTerm.toLowerCase();
                filtered = filtered.filter(exp => 
                    (exp.company && exp.company.toLowerCase().includes(lowercaseSearch)) ||
                    (exp.role && exp.role.toLowerCase().includes(lowercaseSearch)) ||
                    (exp.location && exp.location.toLowerCase().includes(lowercaseSearch)) ||
                    (exp.description && exp.description.toLowerCase().includes(lowercaseSearch)) ||
                    (exp.user && exp.user.name && exp.user.name.toLowerCase().includes(lowercaseSearch))
                );
            }
            
            if (filterCompany) {
                filtered = filtered.filter(exp => exp.company === filterCompany);
            }
            
            setFilteredExperiences(filtered);
        }
    }, [workExperiences, searchTerm, filterCompany]);

    const fetchWorkExperiences = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/work-experience", { withCredentials: true });
            let workExpArray = Array.isArray(response.data) ? response.data.reverse() : [response.data];
            
            // Fetch user details for each work experience
            const updatedWorkExperiences = await Promise.all(
                workExpArray.map(async (workExp) => {
                    try {
                        const userResponse = await axios.get(`http://localhost:8080/api/users/${workExp.user.id}`, { withCredentials: true });
                        return { ...workExp, user: userResponse.data }; // Add user data to work experience
                    } catch {
                        return { ...workExp, user: null }; // Handle errors (user not found, etc.)
                    }
                })
            );
    
            setWorkExperiences(updatedWorkExperiences);
            setFilteredExperiences(updatedWorkExperiences);
        } catch {
            setError("Failed to fetch work experiences");
        } finally {
            setLoading(false);
        }
    };
    
    const deleteWorkExperience = (id) => {
        toast.info(
            <div>
                <p>Are you sure you want to delete this work experience?</p>
                <div className="mt-2 flex justify-center space-x-3">
                    <button 
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => {
                            toast.dismiss();
                            confirmDelete(id);
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
    
    const confirmDelete = (id) => {
        axios.delete(`http://localhost:8080/api/work-experience/${id}`, { withCredentials: true })
            .then(() => {
                setWorkExperiences(workExperiences.filter(exp => exp.id !== id));
                toast.success("Work experience deleted successfully");
            })
            .catch(() => {
                toast.error("Failed to delete work experience.");
            });
    };
    
    const clearFilters = () => {
        setSearchTerm("");
        setFilterCompany("");
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };
    
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.1
            } 
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center p-6">
                <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center p-6">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{error}</h3>
                    <p className="text-gray-600">Please try again later or contact support.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold text-center mb-3 text-indigo-900">
                        <FaBriefcase className="inline-block mr-3 text-indigo-600" />
                        Alumni Work Experiences
                    </h2>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                        Explore the diverse career paths and professional achievements of our alumni network
                    </p>
                </motion.div>

                {/* Search and Filter Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-8 bg-white p-5 rounded-xl shadow-md"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by company, role, location or description..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative">
                                <FaFilter className="absolute left-3 top-3 text-gray-400" />
                                <select
                                    value={filterCompany}
                                    onChange={(e) => setFilterCompany(e.target.value)}
                                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition"
                                >
                                    <option value="">All Companies</option>
                                    {companies.map(company => (
                                        <option key={company} value={company}>{company}</option>
                                    ))}
                                </select>
                            </div>
                            {(searchTerm || filterCompany) && (
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

                {/* Work Experiences Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full"
                >
                    {filteredExperiences.length > 0 ? (
                        <>
                            <div className="mb-4 flex justify-between items-center">
                                <p className="text-gray-600">
                                    Showing {filteredExperiences.length} {filteredExperiences.length === 1 ? 'experience' : 'experiences'}
                                    {searchTerm && ` for "${searchTerm}"`}
                                    {filterCompany && ` at ${filterCompany}`}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredExperiences.map((work) => (
                                    <motion.div
                                        key={work.id}
                                        variants={itemVariants}
                                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden relative group"
                                    >
                                        {/* Company Brand Banner */}
                                        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                                        
                                        <div className="p-6">
                                            {/* Delete Button */}
                                            {user && user.role === "admin" && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteWorkExperience(work.id);
                                                    }}
                                                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition opacity-0 group-hover:opacity-100 z-10"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            )}
                                            
                                            {/* Company and Role */}
                                            <div className="mb-4">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                                                    <FaBuilding className="text-blue-600 mr-2 flex-shrink-0" /> 
                                                    {work.company}
                                                </h3>
                                                <div className="flex items-center text-gray-700 font-medium">
                                                    <FaUserTie className="text-green-600 mr-2 flex-shrink-0" /> 
                                                    {work.role}
                                                </div>
                                            </div>
                                            
                                            {/* Location */}
                                            <div className="mb-3 flex items-center text-gray-600">
                                                <FaMapMarkerAlt className="text-red-500 mr-2 flex-shrink-0" /> 
                                                {work.location}
                                            </div>
                                            
                                            {/* Employment Period */}
                                            <div className="text-gray-600 flex items-center mb-4 text-sm border-l-2 border-yellow-400 pl-2">
                                                <FaCalendarAlt className="text-yellow-500 mr-2 flex-shrink-0" /> 
                                                <span>{formatDate(work.startDate)} - {work.present ? "Present" : formatDate(work.endDate)}</span>
                                            </div>
                                            
                                            {/* Description Preview */}
                                            <div 
                                                className={`text-gray-700 ${expandedId === work.id ? '' : 'line-clamp-3'} text-sm mt-4 mb-2`}
                                            >
                                                {work.description}
                                            </div>
                                            
                                            {/* Read More Toggle */}
                                            {work.description && work.description.length > 150 && (
                                                <button 
                                                    onClick={() => toggleExpand(work.id)}
                                                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors flex items-center"
                                                >
                                                    {expandedId === work.id ? 'Show Less' : 'Read More'}
                                                    <FaChevronRight className={`ml-1 text-xs transition-transform transform ${expandedId === work.id ? 'rotate-90' : ''}`} />
                                                </button>
                                            )}
                                            
                                            {/* Alumni Info */}
                                            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center">
                                                <FaUser className="text-blue-500 mr-2" />
                                                <span className="font-medium text-gray-800">{work.user ? work.user.name : "Unknown User"}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white p-10 rounded-xl shadow-lg text-center"
                        >
                            <FaBriefcase className="mx-auto text-5xl text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No work experiences found</h3>
                            <p className="text-gray-500">
                                {searchTerm || filterCompany ? 
                                    "Try adjusting your search terms or filters." : 
                                    "No work experiences have been added yet."}
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default WorkExperienceList;