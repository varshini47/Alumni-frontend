import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../UserContext";
import nitc from "../assets/NIT-calicut-1024x576.webp";
import { 
  FaCalendarAlt, FaTags, FaUserTie, FaCalendar, FaMapMarkerAlt, 
  FaEnvelope, FaFileAlt, FaHandshake, FaTrash, FaPlus, 
  FaSearch, FaFilter, FaTimes, FaCheckCircle, FaRegFileAlt,
  FaMicrophone, FaInfoCircle 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

function Events() {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    eventType: "",
    organizer: "",
    date: "",
    venue: "",
    contactPersonEmail: "",
    sponsorshipDetails: "",
  });
  
  const eventTypes = [
    "Webinar",
    "Workshop",
    "Conference",
    "Meetup",
    "Reunion",
    "Career Fair",
    "Seminar",
    "Hackathon",
    "Panel Discussion",
    "Networking Event",
    "Other"
  ];

  useEffect(() => {
    fetchEvents();
  }, []);
  
  useEffect(() => {
    let result = events;
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.eventName.toLowerCase().includes(lowercasedSearch) ||
        event.organizer.toLowerCase().includes(lowercasedSearch) ||
        event.description.toLowerCase().includes(lowercasedSearch) ||
        event.eventType.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Apply event type filter
    if (filterType) {
      result = result.filter(event => 
        event.eventType.toLowerCase() === filterType.toLowerCase()
      );
    }
    
    setFilteredEvents(result);
  }, [events, searchTerm, filterType]);

  // Handle form input changes
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
    
    if (!formData.eventName.trim()) errors.eventName = "Event name is required";
    if (!formData.eventType.trim()) errors.eventType = "Event type is required";
    if (!formData.organizer.trim()) errors.organizer = "Organizer is required";
    if (!formData.date) errors.date = "Date is required";
    if (!formData.venue.trim()) errors.venue = "Venue is required";
    if (!formData.contactPersonEmail.trim()) errors.contactPersonEmail = "Contact email is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await axios.post("http://localhost:8080/api/events", formData, { withCredentials: true });
      toast.success("Event posted successfully!");
      setFormData({
        eventName: "",
        description: "",
        eventType: "",
        organizer: "",
        date: "",
        venue: "",
        contactPersonEmail: "",
        sponsorshipDetails: "",
      });
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      console.error("Error posting event", error);
      toast.error("Failed to post event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (eventId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this event?</p>
        <div className="mt-2 flex justify-center space-x-3">
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => {
              toast.dismiss();
              deleteEvent(eventId);
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
  
  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:8080/api/events/${eventId}`, { withCredentials: true });
      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event", error);
      toast.error("Failed to delete event");
    }
  };

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/events", { withCredentials: true });
      const eventsArray = Array.isArray(response.data) ? response.data.reverse() : [response.data];
      setEvents(eventsArray);
      setFilteredEvents(eventsArray);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    }
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("");
  };
  
  // Format date to look better
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if an event is upcoming (today or in the future)
  const isUpcoming = (dateString) => {
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return eventDate >= today;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-12 px-4">
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
              Upcoming Events
            </h1>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              Stay connected with the alumni community through webinars, meetups, and networking opportunities
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
                  placeholder="Search events by name, organizer, or type..."
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
                    <option value="">All Event Types</option>
                    {eventTypes.map(type => (
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

        {/* Add Event Button */}
        {user && user.firstName && !showForm && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => setShowForm(true)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-4 rounded-full shadow-lg z-10 flex items-center gap-2 hover:from-blue-500 hover:to-indigo-700 transition-all"
          >
            <FaPlus className="text-lg" /> 
            <span className="hidden md:inline">Add Event</span>
          </motion.button>
        )}

        {/* Event Posting Form Modal */}
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
                    Create New Event
                  </h2>
                  <p className="text-center text-indigo-100 mt-1">
                    Share events with the alumni community
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
                      {/* Event Name */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Event Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-3 top-3 text-blue-500" />
                          <input
                            name="eventName"
                            placeholder="e.g., Annual Alumni Meetup 2023"
                            value={formData.eventName}
                            onChange={handleChange}
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                              formErrors.eventName ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {formErrors.eventName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.eventName}</p>
                        )}
                      </div>
                      
                      {/* Event Type */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Event Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaTags className="absolute left-3 top-3 text-blue-500" />
                          <select
                            name="eventType"
                            value={formData.eventType}
                            onChange={handleChange}
                            className={`w-full p-3 pl-10 border rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 transition ${
                              formErrors.eventType ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">Select Event Type</option>
                            {eventTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        {formErrors.eventType && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.eventType}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Organizer */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Organizer <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaUserTie className="absolute left-3 top-3 text-blue-500" />
                          <input
                            name="organizer"
                            placeholder="e.g., Alumni Association, CS Department"
                            value={formData.organizer}
                            onChange={handleChange}
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                              formErrors.organizer ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {formErrors.organizer && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.organizer}</p>
                        )}
                      </div>
                      
                      {/* Event Date */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Event Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaCalendar className="absolute left-3 top-3 text-blue-500" />
                          <input
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]} // Prevent past dates
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                              formErrors.date ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {formErrors.date && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Venue */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Venue <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 top-3 text-blue-500" />
                          <input
                            name="venue"
                            placeholder="e.g., Main Hall, or Zoom URL for virtual events"
                            value={formData.venue}
                            onChange={handleChange}
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                              formErrors.venue ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {formErrors.venue && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.venue}</p>
                        )}
                      </div>
                      
                      {/* Contact Person Email */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Contact Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-3 text-blue-500" />
                          <input
                            name="contactPersonEmail"
                            type="email"
                            placeholder="Contact person's email address"
                            value={formData.contactPersonEmail}
                            onChange={handleChange}
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                              formErrors.contactPersonEmail ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {formErrors.contactPersonEmail && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.contactPersonEmail}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Event Description <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaFileAlt className="absolute left-3 top-3 text-blue-500" />
                        <textarea
                          name="description"
                          placeholder="Describe the event, its purpose, and what attendees can expect..."
                          value={formData.description}
                          onChange={handleChange}
                          rows="4"
                          className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                            formErrors.description ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {formErrors.description && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                      )}
                    </div>
                    
                    {/* Sponsorship Details (Optional) */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Sponsorship Details <span className="text-gray-400 text-xs">(Optional)</span>
                      </label>
                      <div className="relative">
                        <FaHandshake className="absolute left-3 top-3 text-blue-500" />
                        <textarea
                          name="sponsorshipDetails"
                          placeholder="Information about event sponsors or sponsorship opportunities..."
                          value={formData.sponsorshipDetails}
                          onChange={handleChange}
                          rows="3"
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                        />
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-400 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-700 transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                          <span>Posting...</span>
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          <span>Post Event</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events Listing */}
        {!showForm && (
          <div className="mt-8">
            {filteredEvents.length > 0 ? (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-600">
                    Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                    {searchTerm && ` for "${searchTerm}"`}
                    {filterType && ` in category ${filterType}`}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all relative group overflow-hidden ${
                        !isUpcoming(event.date) ? "border-l-4 border-gray-300" : "border-l-4 border-green-500"
                      }`}
                    >
                      {/* Event type badge */}
                      <div className="absolute top-0 right-0">
                        <div className="bg-indigo-100 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-bl-lg">
                          {event.eventType}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        {/* Admin delete button */}
                        {user && user.role === "admin" && (
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                        
                        {/* Date as a separate highlighted component */}
                        <div className="float-right ml-4 mb-3 bg-indigo-50 rounded-lg p-2 text-center min-w-[4.5rem]">
                          <div className="text-xs uppercase text-blue-600 font-semibold">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-2xl font-bold text-indigo-800">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="text-xs text-blue-600">
                            {new Date(event.date).getFullYear()}
                          </div>
                        </div>
                        
                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {event.eventName}
                          </h3>
                          <div className="flex items-center text-gray-700">
                            <FaUserTie className="text-blue-500 mr-2" />
                            <span className="font-medium">{event.organizer}</span>
                          </div>
                        </div>
                        
                        {/* Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-start">
                            <FaMapMarkerAlt className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-gray-600">{event.venue}</span>
                          </div>
                          
                          {/* Description preview */}
                          <div className="text-gray-700 text-sm line-clamp-3 mt-3">
                            {event.description}
                          </div>
                        </div>
                        
                        {/* Footer with contact info and sponsorship */}
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center text-gray-600 text-sm">
                            <FaEnvelope className="mr-2 text-blue-500" />
                            <span>Contact: {event.contactPersonEmail}</span>
                          </div>
                          
                          {event.sponsorshipDetails && (
                            <div className="flex items-center text-gray-600 text-sm mt-2">
                              <FaHandshake className="mr-2 text-blue-500" />
                              <span className="line-clamp-1">Sponsorship: {event.sponsorshipDetails}</span>
                            </div>
                          )}
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
                className="bg-white p-10 rounded-xl shadow-md text-center"
              >
                <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No events found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterType ? 
                    "Try adjusting your search filters or check back later for new events." : 
                    "There are no events posted yet. Be the first to create an event for the alumni community."}
                </p>
                {user && user.firstName && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg inline-flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition"
                  >
                    <FaPlus />
                    <span>Create Event</span>
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

export default Events;


