import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaTrophy, FaCalendarAlt, FaBuilding, FaUser, FaPlus } from "react-icons/fa";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AchievementsList = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get("https://alumni-back-yabh.onrender.com/api/achievements/all", { withCredentials: true });
        const achievementsArray = Array.isArray(response.data) ? response.data.reverse() : [response.data];
        setAchievements(achievementsArray);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setError("Failed to fetch achievements.");
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this achievement?")) return;
  //   try {
  //     await axios.delete(`https://alumni-back-yabh.onrender.com/api/achievements/${id}`, { withCredentials: true });
  //     setAchievements(achievements.filter(achievement => achievement.id !== id));
  //     toast.success("Achievement deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting achievement:", error);
  //     toast.error("Failed to delete achievement.");
  //   }
  // };

  const handleDelete = (id) => {
    toast.info(
        <div>
            <p>Are you sure you want to delete this achievement?</p>
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
    axios.delete(`https://alumni-back-yabh.onrender.com/api/achievements/${id}`, { withCredentials: true })
        .then(() => {
            setAchievements(achievements.filter(achievement => achievement.id !== id));
            toast.success("Achievement deleted successfully");
        })
        .catch(() => {
            toast.error("Failed to delete work experience.");
        });
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

  const getAchievementColor = (category) => {
    const colors = {
      "Academic": "from-blue-500 to-indigo-600",
      "Professional": "from-green-500 to-emerald-600",
      "Social": "from-orange-400 to-pink-500",
      "Award": "from-yellow-400 to-amber-600",
      "Other": "from-purple-500 to-violet-600"
    };
    return colors[category] || "from-gray-500 to-slate-700";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Academic":
        return "🎓";
      case "Professional":
        return "💼";
      case "Social":
        return "🤝";
      case "Award":
        return "🏆";
      default:
        return "🎯";
    }
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
            <FaTrophy className="inline-block mr-3 text-yellow-500" />
            Alumni Achievements
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            Celebrating the outstanding accomplishments and milestones of our distinguished alumni community.
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          {achievements.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-10 rounded-xl shadow-lg text-center"
            >
              <FaTrophy className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No achievements found</h3>
              <p className="text-gray-500">No achievements have been added yet.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="relative overflow-hidden rounded-xl shadow-lg bg-white"
                >
                  {/* Category Banner */}
                  <div className={`h-2 bg-gradient-to-r ${getAchievementColor(achievement.category)}`}></div>
                  
                  {/* Image Section */}
                  {achievement.supportingDocuments && (
                    <div className="overflow-hidden h-48">
                      <img
                        src={achievement.supportingDocuments}
                        alt="Achievement"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{getCategoryIcon(achievement.category)}</span>
                      <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        {achievement.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                    
                    <div className="flex items-center text-gray-500 mb-3">
                      <FaCalendarAlt className="mr-2" />
                      <span>{new Date(achievement.dateOfAchievement).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-3">{achievement.description}</p>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center text-gray-600 mb-2">
                        <FaBuilding className="mr-2 text-indigo-500" />
                        <span className="font-medium">{achievement.organization}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaUser className="mr-2 text-indigo-500" />
                        <span className="font-medium">{achievement.alumniName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button (Only for Admins) */}
                  {user && user.role === "admin" && (
                    <button
                      onClick={() => handleDelete(achievement.id)}
                      className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition shadow-md z-10"
                    >
                      <FaTrash size={16} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Add Achievement Button (Admin only) */}
        {user && user.role === "admin" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/add-achievements")}
            className="fixed bottom-[40px] right-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300 font-semibold flex items-center space-x-2"
          >
            <FaPlus size={16} />
            <span>Add Achievement</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default AchievementsList;
