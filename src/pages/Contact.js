import { Link } from "react-router-dom";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import nitcLogo from '../assets/nitclogo.jpeg';
import userImage from '../assets/user.webp';
import '../index.css';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Send the contact form data to the backend
      await axios.post('http://localhost:8080/api/contact/submit', formData,{withCredentials:true});
      
      toast.success("Thank you for your message! We'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to submit your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or want to connect with the Alumni Association? Reach out to our team members below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Team Members */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-400 h-8"></div>
            <div className="p-6 text-center">
              <div className="relative mb-4">
                <img src={userImage} alt="Prof. Jayant Krishna" className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-white shadow-lg -mt-16" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Prof. Jayant Krishna</h3>
              <p className="text-blue-700 font-medium mb-2">Dean Outreach</p>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center justify-center">
                  <FaEnvelope className="mr-2 text-blue-400" />
                  <a href="mailto:deanor@adm.nitc.ac.in" className="hover:text-blue-400 transition">deanor@adm.nitc.ac.in</a>
                </p>
                <p className="flex items-center justify-center">
                  <FaPhone className="mr-2 text-blue-400" />
                  03222-282036
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-400 h-8"></div>
            <div className="p-6 text-center">
              <div className="relative mb-4">
                <img src={userImage} alt="Prof. Debashish Chakravarty" className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-white shadow-lg -mt-16" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Prof. Debashish Chakravarty</h3>
              <p className="text-blue-700 font-medium mb-2">Associate Dean, Alumni Affairs & Branding</p>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center justify-center">
                  <FaEnvelope className="mr-2 text-blue-400" />
                  <a href="mailto:adeanaa@adm.nitc.ac.in" className="hover:text-blue-400 transition">adeanaa@adm.nitc.ac.in</a>
                </p>
                <p className="flex items-center justify-center">
                  <FaPhone className="mr-2 text-blue-400" />
                  03222-281019
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-400 h-8"></div>
            <div className="p-6 text-center">
              <div className="relative mb-4">
                <img src={userImage} alt="Mrs. Archana Biswas" className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-white shadow-lg -mt-16" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Mrs. Archana Biswas</h3>
              <p className="text-blue-700 font-medium mb-2">Senior Executive Officer, Alumni Affairs</p>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center justify-center">
                  <FaEnvelope className="mr-2 text-blue-400" />
                  <a href="mailto:archana.biswas@nitc.ac.in" className="hover:text-blue-400 transition">archana.biswas@nitc.ac.in</a>
                </p>
                <p className="flex items-center justify-center">
                  <FaPhone className="mr-2 text-blue-400" />
                  03222-281858
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-br from-blue-400 to-indigo-400 p-8 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Get In Touch</h3>
              <p className="mb-6">We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.</p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-4 text-xl" />
                  <p>NIT Campus P.O., Calicut, Kerala, India - 673601</p>
                </div>
                <div className="flex items-center">
                  <FaPhone className="mr-4 text-xl" />
                  <p>+91-495-2286119</p>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="mr-4 text-xl" />
                  <p>alumni@nitc.ac.in</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 px-4 rounded-md transition duration-300 disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

