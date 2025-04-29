import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import axios from "axios";
import nitcLogo from "../assets/nitclogo.jpeg";
import { useState } from "react";
import { FaSearch ,FaSignOutAlt} from "react-icons/fa"; 
import userImg from '../assets/user.webp';
import { toast } from 'react-toastify';


function Header() {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchType, setSearchType] = useState("Name");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await axios.post("https://alumni-back-yabh.onrender.com/api/logout", {}, { withCredentials: true });
      logoutUser();
      toast.success("You have successfully logged out!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.warning("Please enter a search query.");
      return;
    }

    // Construct search parameters
    const searchParams = new URLSearchParams({
      type: searchType.toLowerCase().replace(" ", "_"),
      query: searchQuery,
    });

    // Navigate to search results page
    navigate(`/search?${searchParams.toString()}`);

    // Clear input after search
    setSearchQuery("");
  };

  // Add this function to handle key press events for search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isProfilePage = user && location.pathname === `/profile/${user.id}`;

  // Function to check if a link is active
  // const isActive = (path) => location.pathname === path ? "text-blue-900 font-bold underline" : "hover:text-blue-700 transition";
 // Function to check if a link is active
const isActive = (path) =>
  location.pathname === path
    ? "bg-blue-500 text-white px-5 py-2 rounded-md"
    : "hover:text-blue-900 transition rounded-md";

  return (
    <nav className="bg-blue-200 shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* <div className="flex items-center space-x-2">

          <Link to="/chat" className="px-4 py-2 bg-blue-500 text-white rounded">Chat</Link>
        </div>    */}

        {/* Left Side: Logo & Title */}
        <div className="flex items-center space-x-3">
          <img src={nitcLogo} alt="NITC Logo" className="h-10 w-10" />
          <Link to="/" className="text-xl font-bold text-blue-700">ALUMNI ASSOCIATION</Link>
        </div>

        {/* 🔍 Stylish Search Bar */}
        <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 bg-gray-100 shadow-md">
          <select
            className="bg-transparent text-gray-700 text-sm font-medium focus:outline-none cursor-pointer"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="Name">Name</option>
            <option value="Batch">Batch</option>
            <option value="Company Name">Company Name</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchType}`}
            className="ml-2 px-3 py-1 bg-transparent focus:outline-none w-40 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <button
            onClick={handleSearch}
            className="ml-2 bg-blue-600 text-white px-4 py-1.5 rounded-full shadow-md hover:bg-blue-700 transition flex items-center"
          >
            <FaSearch className="mr-1" />
            Search
          </button>
        </div>

        {/* Right Side: Links & User Actions */}
        <div className="flex items-center space-x-6 text-gray-600">
          <Link to="/about" className={isActive("/about")}>About Us</Link>
          <Link to="/connections" className={isActive("/connections")}>Connections</Link>
          <Link to="/events" className={isActive("/events")}>Events</Link>
          <Link to="/gallery" className={isActive("/gallery")}>Gallery</Link>
          <Link to="/contact" className={isActive("/contact")}>Contact</Link>

          {!user || !user.firstName ? (
            <div className="space-x-3">
              <Link to="/login" className="px-4 py-2 text-blue-700 border border-blue-700 rounded-md shadow hover:bg-blue-700 hover:text-white transition">Log In</Link>
              <Link to="/register" className="px-4 py-2 bg-blue-700 text-white rounded-md shadow hover:bg-blue-800 transition">Register</Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">

              {!isProfilePage && user.role === "ALUMNI" && (
                <img src={user.imageUrl || userImg} alt="User Profile" className="h-10 w-10 rounded-full object-cover" />
              )}
             
              
              {/* <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition">Logout</button> */}
              {!isProfilePage && user.role === "ALUMNI" && (
                <Link to={`/profile/${user.id}`} className="px-4 py-2 bg-blue-700 text-white rounded-md shadow hover:bg-blue-800 transition">View Profile</Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin-dashboard" className="px-4 py-2 bg-blue-700 text-white rounded-md shadow hover:bg-blue-800 transition">Admin Dashboard</Link>
              )}

              <button 
                  onClick={handleLogout} 
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;

