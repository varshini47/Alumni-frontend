// import { Link } from "react-router-dom";
// import { useUser } from "../UserContext";
// import { useNavigate } from "react-router-dom";

// import axios from "axios";
// import nitcLogo from '../assets/nitclogo.jpeg';
// import nitcImage from '../assets/nitc.png'; // Make sure to add your logo image
// import '../index.css'
// function About() {
//   const { user, logoutUser } = useUser();
//   const navigate = useNavigate();
 
//   const handleLogout = async () => {
//     try {
//       await axios.post("https://alumni-back-yabh.onrender.com/api/logout", {}, { withCredentials: true });
//       logoutUser();
//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

 



//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navigation Bar */}
    

//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//     <div className="bg-white p-6 rounded-lg shadow-lg text-center w-2/3 md:w-1/2 lg:w-1/3">
//         <h1 className="text-2xl font-bold text-gray-800">ABOUT US</h1>
//         <p className="text-gray-600 mt-3">
//             Welcome to our platform! We are dedicated to connecting alumni and fostering meaningful relationships.
//             An active and vibrant alumni forum is an asset for any Institute
// as well as for the Alumni fraternity and the students. As for our
// AlmaMater the Alumni body was 'RECCAA' - a forum confined
// to the institute without much connect with the Alumni
// fraternity and not able to contribute to the Alma mater, the
// way it was supposed to. Over time institutions transform and
// our alma mater also transformed from 'REC' to 'NIT' while the
// alumni forum remained as 'RECCAA' disconnected from the
// regional chapters. At the same time there existed another forum
// 'World NITCAA Council' which was supposed to be the apex
// body of the alumni regional chapters, again just a concept
// formed by the regional chapters to organise the World NITCАА
// Meet once every two years. The issue was that RECCAA had the
// legal standing but with practically no connect with the regional
// Chapters and the World NITCAA Council, which did not have
// any legal structure but was well connected with the regional
// chapters.
//         </p>
//     </div>
//     </div>

//       {/* Footer */}
     
//     </div>
//   );
// }

// export default About;


import { Link } from "react-router-dom";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import nitcLogo from '../assets/nitclogo.jpeg';
import nitcImage from '../assets/nitc.png';
import '../index.css';

function About() {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={nitcImage} 
                alt="NITC Campus" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <div className="flex items-center mb-6">
                <img src={nitcLogo} alt="NITC Logo" className="h-16 w-16 mr-4" />
                <h1 className="text-3xl font-bold text-gray-800">About NITC Alumni Association</h1>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Welcome to our platform! We are dedicated to connecting alumni and fostering meaningful relationships that benefit both our graduates and the institute.
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Our Story</h2>
          
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>
              An active and vibrant alumni forum is an asset for any Institute as well as for the Alumni fraternity and the students. As for our AlmaMater the Alumni body was 'RECCAA' - a forum confined to the institute without much connect with the Alumni fraternity and not able to contribute to the Alma mater, the way it was supposed to.
            </p>
            
            <p>
              Over time institutions transform and our alma mater also transformed from 'REC' to 'NIT' while the alumni forum remained as 'RECCAA' disconnected from the regional chapters. At the same time there existed another forum 'World NITCAA Council' which was supposed to be the apex body of the alumni regional chapters, again just a concept formed by the regional chapters to organise the World NITCАА Meet once every two years.
            </p>
            
            <p>
              The issue was that RECCAA had the legal standing but with practically no connect with the regional Chapters and the World NITCAA Council, which did not have any legal structure but was well connected with the regional chapters.
            </p>
          </div>
          
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Our Mission</h3>
            <p className="text-gray-700">
              To build stronger connections between alumni and the institute, foster professional networking, and create opportunities for current students through the experience and support of our graduates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;