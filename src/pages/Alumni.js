import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrashAlt, FaUserGraduate, FaUsers, FaSearch, FaFilter, FaBuilding, FaGraduationCap, FaUserClock, FaUserCheck } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useUser } from "../UserContext";

const AlumniList = () => {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [connections, setConnections] = useState({});
  const navigate = useNavigate();
  const { user } = useUser();
  
  const isAdmin = user && user.role === "admin";

  useEffect(() => {
    fetchAlumni();
    fetchConnections();
  }, [user.id,alumni.id]);

  // const fetchConnections = async () => {
  //   try {
  //     const response = await axios.get(`https://alumni-back-yabh.onrender.com/api/connections/user/${user.id}`, { withCredentials: true });
  //     const connectionsMap = {};
  //     response.data.forEach(conn => {
  //       if (conn.sender.id === user.id) {
  //         connectionsMap[conn.receiver.id] = conn.status;
  //       } else {
  //         connectionsMap[conn.sender.id] = conn.status;
  //       }
  //     });
  //     setConnections(connectionsMap);
  //   } catch (error) {
  //     console.error("Error fetching connections:", error);
  //   }
  // };

  const fetchConnections = async () => {
    try {
      const response = await axios.get(
        `https://alumni-back-yabh.onrender.com/api/connections/user/${user.id}`,
        { withCredentials: true }
      );
  
      const { pending, accepted } = response.data; // Destructure response
      console.log(response.data);
      //const connectionsMap = {};
  
      // Process pending connections
      pending.forEach((conn) => {
        if (conn.sender.id === user.id) {
          connections[conn.receiver.id] = "PENDING";
        } else {
          connections[conn.sender.id] = "PENDING";
        }
      });
  
      // Process accepted connections
      accepted.forEach((conn) => {
        if (conn.sender.id === user.id) {
          connections[conn.receiver.id] = "ACCEPTED";
        } else {
          connections[conn.sender.id] = "ACCEPTED";
        }
      });
  
      setConnections(connections);
      console.log(connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };
  

  const sendRequest = async (receiverId) => {
    try {
      await axios.post(`https://alumni-back-yabh.onrender.com/api/connections/send/${user.id}/${receiverId}`, {}, { withCredentials: true });
      setConnections(prev => ({ ...prev, [receiverId]: 'PENDING' }));
      toast.success("Connection request sent!");
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Failed to send connection request");
    }
  };

  const getConnectionStatus = (userId) => {
    if (!user || userId === user.id) return null;
    return connections[userId] || null;
  };

  const renderConnectionButton = (alumnus) => {
    console.log(alumnus.id);
    const status = getConnectionStatus(alumnus.id);
    console.log(status);
    if (!status)
       return (
      <button 
        onClick={() => sendRequest(alumnus.id)}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
      >
        <span>Connect</span>
      </button>
    );

    switch (status) {
      case 'ACCEPTED':
        return (
          <button className="flex items-center space-x-2 text-green-600">
            <FaUserCheck />
            <span>Connected</span>
          </button>
        );
      case 'PENDING':
        return (
          <button className="flex items-center space-x-2 text-yellow-600">
            <FaUserClock />
            <span>Pending</span>
          </button>
        );
      case 'REJECTED':
        return (
          <button 
            onClick={() => sendRequest(alumnus.id)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <span>Connect</span>
          </button>
        );
      default:
        return (
          <button 
            onClick={() => sendRequest(alumnus.id)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <span>Connect</span>
          </button>
        );
    }
  };

  useEffect(() => {
    if (alumni.length > 0) {
      // Extract unique batches and departments for filters
      const batches = [...new Set(alumni.map(a => a.batch).filter(Boolean))].sort((a, b) => b - a);
      const departments = [...new Set(alumni.map(a => a.department).filter(Boolean))].sort();
      
      setAvailableBatches(batches);
      setAvailableDepartments(departments);
      
      applyFilters();
    }
  }, [alumni, searchTerm, filterBatch, filterDepartment]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://alumni-back-yabh.onrender.com/api/users", { withCredentials: true });
      const alumniData = response.data;
      setAlumni(alumniData);
      setFilteredAlumni(alumniData);
    } catch (error) {
      console.error("Error fetching alumni:", error);
      toast.error("Failed to load alumni list");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...alumni];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(alumnus => 
        alumnus.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumnus.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumnus.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply batch filter
    if (filterBatch) {
      filtered = filtered.filter(alumnus => alumnus.batch === filterBatch);
    }
    
    // Apply department filter
    if (filterDepartment) {
      filtered = filtered.filter(alumnus => alumnus.department === filterDepartment);
    }
    
    setFilteredAlumni(filtered);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterBatch("");
    setFilterDepartment("");
  };

  const handleDelete = async (id) => {
    // Show confirmation toast with action buttons
    toast.info(
      <div>
        <p>Are you sure you want to delete this alumni?</p>
        <div className="mt-2 flex justify-center space-x-3">
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => {
              toast.dismiss();
              deleteAlumni(id);
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

  const deleteAlumni = async (id) => {
    try {
      await axios.delete(`https://alumni-back-yabh.onrender.com/api/users/${id}`, { withCredentials: true });
      setAlumni(alumni.filter((alumnus) => alumnus.id !== id));
      toast.success("Alumni deleted successfully");
    } catch (error) {
      console.error("Error deleting alumni:", error);
      toast.error("Failed to delete alumni. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-700">Loading alumni data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header & Stats */}
        <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-xl mb-8 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Alumni Directory</h1>
              <p className="mt-2 text-blue-100">Connect with your fellow graduates</p>
            </div>
            <div className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-lg flex items-center">
              <FaUsers className="text-2xl mr-3" />
              <div>
                <p className="text-sm">Total Registered</p>
                <p className="text-2xl font-bold">{alumni.length} Alumni</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Batch Filter */}
            <div className="lg:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGraduationCap className="text-gray-400" />
                </div>
                <select
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">All Batches</option>
                  {availableBatches.map(batch => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Department Filter */}
            <div className="lg:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBuilding className="text-gray-400" />
                </div>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">All Departments</option>
                  {availableDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Reset Filters */}
            {(searchTerm || filterBatch || filterDepartment) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          {/* Results Count */}
          <div className="mt-4 text-gray-500 text-sm">
            Showing {filteredAlumni.length} of {alumni.length} alumni
          </div>
        </div>
        
        {/* Alumni Grid */}
        {filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumnus) => (
              <div
                key={alumnus.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden group"
              >
                <div 
                  onClick={() => navigate(`/profile/${alumnus.id}`)}
                  className="p-5 cursor-pointer flex flex-col"
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-300">
                      {alumnus.imageUrl ? (
                        <img src={alumnus.imageUrl} alt={alumnus.name} className="w-full h-full object-cover" />
                      ) : (
                        <FaUserGraduate className="text-blue-500 text-2xl" />
                      )}
                    </div>

                    {/* Alumni Info */}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">{alumnus.name}</h2>
                      <p className="text-gray-500">{alumnus.email}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Batch</p>
                      <p className="font-medium text-gray-800">{alumnus.batch || "Not specified"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="font-medium text-gray-800">{alumnus.department || "Not specified"}</p>
                    </div>
                  </div>

                  {/* Connection Button */}
                  <div className="mt-4 flex justify-end">
                    {renderConnectionButton(alumnus)}
                  </div>
                </div>

                {/* Admin Delete Button */}
                {isAdmin && (
                  <div className="bg-gray-50 px-5 py-3 flex justify-end">
                    <button
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(alumnus.id);
                      }}
                      title="Delete alumni"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No alumni found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters to find alumni</p>
            <button 
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniList;
