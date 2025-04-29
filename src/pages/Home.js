import { Link } from "react-router-dom";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import nitcImage from '../assets/nitc_enhanced.png';
import achievement from '../assets/achievement.png';
import job from '../assets/job.png';
import leaderboard from '../assets/leaderboard.png';
import userImg from '../assets/user.webp';
import { FaComments, FaUserPlus, FaPaperPlane } from "react-icons/fa"; 
import '../index.css';
import { toast } from "react-toastify";

function Home() {
  const { user, logoutUser } = useUser();
  const [alumni, setAlumni] = useState([]);
  const [events, setEvents] = useState([]);
  const [emails, setEmails] = useState([""]);
  const [isSending, setIsSending] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
      logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    fetchAlumni();
    fetchEvents();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users", { withCredentials: true });
      setAlumni(response.data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Error fetching alumni:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/events", { withCredentials: true });
      const eventsArray = Array.isArray(response.data) ? response.data.reverse() : [response.data];
      setEvents(eventsArray);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const monthAbbr = monthNames[parseInt(month, 10) - 1];
    return { day, monthAbbr };
  };

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const addEmailField = () => {
    if (emails.every(email => email.trim() !== "" && isValidEmail(email))) {
      setEmails([...emails, ""]);
    } else {
      toast.warning("Please enter a valid email before adding more.");
    }
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const removeEmailField = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleEmailKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      if (index === emails.length - 1) {
        if (isValidEmail(emails[index])) {
          addEmailField();
        } else if (emails.some(email => isValidEmail(email.trim()))) {
          sendInvite();
        }
      }
    }
  };

  const sendInvite = async () => {
    if (emails.every(email => email.trim() === "")) {
      toast.warning("Please enter at least one email before sending.");
      return;
    }
    if(!emails.every(email => isValidEmail(email.trim()))){
      toast.warning("Please enter all fields!")
      return;
    }

    setIsSending(true);
    try {
      await axios.post("http://localhost:8080/api/email/invite", {
        userId: user.id,
        fromEmail: user.email,
        toEmails: emails,
        name: user.firstName,
        registrationLink: "http://localhost:3000/register"
      }, { withCredentials: true });
      toast.success("Invitation sent successfully!");
      setEmails([""]); // Reset input fields
      setOpen(false);  // Close the invite box
    } catch (error) {
        toast.error("Error sending invite:", error);
    } finally {
      setIsSending(false); // Reset loading state
    }
  };

  const handleInviteClick = () => {
    if (!user || !user.firstName) {
      toast.info("Please log in to invite peers");
      navigate("/login");
    } else {
      setOpen(true);
    }
  };

  const handleChatClick = (e) => {
    e.preventDefault();
    if (!user || !user.firstName) {
      toast.info("Please log in to access the chat");
      navigate("/login");
    } else if (user.role === "admin") {
      toast.warning("Chat feature is only available for alumni");
    } else {
      navigate("/chat");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Hero Section with Blurred Background instead of White Box */}
      <div className="relative h-[600px]">
        <img 
          src={nitcImage} 
          alt="NITC Campus" 
          className="w-full h-full object-cover object-center"
        />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="backdrop-blur-sm bg-black/30 p-8 rounded-lg max-w-xl ml-0 mr-auto text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-sm">
                Welcome to NITC Alumni Network
              </h1>
              <p className="text-lg mb-8 text-white/90">
                Connect with fellow alumni, share achievements, and explore opportunities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {!user || !user.firstName ? (
                  <>
                    <Link to="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md text-lg font-semibold transition shadow-md">
                      Log In
                    </Link>
                    <Link to="/register" className="px-6 py-3 bg-white hover:bg-gray-100 text-blue-900 text-center rounded-md text-lg font-semibold transition shadow-md">
                      Register
                    </Link>
                  </>
                ) : (
                  <Link to="/alumni" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md text-lg font-semibold transition shadow-md">
                    Explore Alumni
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">Discover What We Offer</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Achievements Card */}
          <div className="group bg-white rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="h-48 overflow-hidden relative">
              <img src={achievement} alt="Achievements" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">Alumni Achievements</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">Celebrate and get inspired by the accomplishments of our esteemed alumni across various fields.</p>
              <Link to="/achievements" className="text-blue-600 font-semibold hover:text-blue-800 transition">
                Explore Achievements →
              </Link>
            </div>
          </div>

          {/* Job Opportunities Card */}
          <div className="group bg-white rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="h-48 overflow-hidden relative">
              <img src={job} alt="Jobs" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">Job Opportunities</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">Find or share career opportunities within the alumni network to help fellow graduates.</p>
              <Link to="/job-opportunities" className="text-green-600 font-semibold hover:text-green-800 transition">
                View Opportunities →
              </Link>
            </div>
          </div>

          {/* Leaderboard Card */}
          <div className="group bg-white rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="h-48 overflow-hidden relative">
              <img src={leaderboard} alt="Leaderboard" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">Alumni Leaderboard</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">Recognize the most active and contributive members of our alumni community.</p>
              <Link to="/leaderboard" className="text-purple-600 font-semibold hover:text-purple-800 transition">
                View Leaderboard →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Members & Events */}
      <div className="container mx-auto px-4 md:px-20 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-7xl">
        {/* Latest Members */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Latest Members</h3>
          <div className="flex flex-col space-y-4">
            {alumni.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:bg-gray-200 transition"
                onClick={() => navigate(`/profile/${member.id}`)}
              >
                <img src={member.imageUrl || userImg} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{member.name}</h4>
                  <p className="text-gray-600">{member.batch}</p>
                  <p className="text-gray-500">{member.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Events</h3>
          <div className="space-y-4">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-start space-x-4 bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition">
                <div className="bg-white p-2 rounded-lg shadow-md text-center w-16">
                  <div className="text-sm text-gray-700 font-semibold">{formatDate(event.date).monthAbbr}</div>
                  <div className="text-2xl font-bold text-blue-700">{formatDate(event.date).day}</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{event.eventName}</h4>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Improved Floating Action Buttons */}
      {/* Chat Button - Tooltip appears to the right */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={handleChatClick}
          className="group relative w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center rounded-full shadow-xl hover:shadow-green-200/50 transition-all duration-300 hover:scale-110"
        >
          <FaComments className="text-2xl" />
          <span className="absolute whitespace-nowrap left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-green-800 text-white text-sm py-1 px-3 rounded-lg pointer-events-none">
            Chat with Alumni
          </span>
        </button>
      </div>

      {/* Invite Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleInviteClick}
          className="group relative w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center rounded-full shadow-xl hover:shadow-blue-200/50 transition-all duration-300 hover:scale-110"
        >
          <FaUserPlus className="text-2xl" />
          <span className="absolute whitespace-nowrap right-full mr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-800 text-white text-sm py-1 px-3 rounded-lg pointer-events-none">
            Invite Peers
          </span>
        </button>
      </div>

      {/* Enhanced Invite Modal */}
      {open && (
        <div
          ref={modalRef}
          className="modal bg-white rounded-xl shadow-2xl fixed bottom-24 right-6 w-96 border border-gray-200 z-50 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <FaUserPlus className="mr-3" /> Invite Your Peers
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              Help grow our alumni community
            </p>
          </div>

          <div className="p-6">
            {emails.map((email, index) => (
              <div key={index} className="mb-3">
                <div className="flex items-center">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    onKeyPress={(e) => handleEmailKeyPress(e, index)}
                    className={`w-full p-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 ${
                      email && !isValidEmail(email) 
                        ? "border-red-400 focus:ring-red-200" 
                        : "border-gray-300 focus:ring-blue-200"
                    }`}
                  />
                  {emails.length > 1 && (
                    <button
                      onClick={() => removeEmailField(index)}
                      className="ml-2 p-2 text-red-500 hover:text-red-700 transition"
                    >
                      ×
                    </button>
                  )}
                </div>
                {email && !isValidEmail(email) && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={addEmailField}
                className="flex items-center justify-center p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                <span className="mr-2">+</span> Add Another Email
              </button>
              
              <button
                onClick={sendInvite}
                disabled={isSending || !emails.some(email => isValidEmail(email.trim()))}
                className={`flex items-center justify-center p-3 rounded-lg text-white font-medium transition ${
                  isSending || !emails.some(email => isValidEmail(email.trim()))
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {isSending ? (
                  "Sending..."
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" /> Send Invitations
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;