// function Footer(){
//     return(
//         < footer className="bg-pink-100 py-6 mt-auto" >
//         <div className="container mx-auto text-center">
//           <div className="flex justify-center space-x-4 mb-4">
//             <a href="https://m.facebook.com/NIT.Calicut.Kerala/" className="text-gray-600 hover:text-gray-900">Facebook</a>
//             <a href="https://www.instagram.com/nitcofficial?igsh=MWw4dWtoZHFqdGphZg==" className="text-gray-600 hover:text-gray-900">Instagram</a>
//             <a href="https://x.com/nitcofficial?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" className="text-gray-600 hover:text-gray-900">Twitter</a>
//             <a href="https://in.linkedin.com/school/national-institute-of-technology-calicut/" className="text-gray-600 hover:text-gray-900">LinkedIn</a>
//           </div>
//           <p className="text-sm text-gray-600">Copyright ©2025 All rights reserved</p>
//         </div>
//       </footer >
//     );
// }

// export default Footer;

import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-blue-200 shadow-lg text-black py-8 mt-auto">
      <div className="container mx-auto text-center px-6">
        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://m.facebook.com/NIT.Calicut.Kerala/" className="hover:text-blue-400 transition transform hover:scale-110">
            <FaFacebookF size={22} />
          </a>
          <a href="https://www.instagram.com/nitcofficial?igsh=MWw4dWtoZHFqdGphZg==" className="hover:text-pink-400 transition transform hover:scale-110">
            <FaInstagram size={22} />
          </a>
          <a href="https://x.com/nitcofficial?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" className="hover:text-blue-300 transition transform hover:scale-110">
            <FaTwitter size={22} />
          </a>
          <a href="https://in.linkedin.com/school/national-institute-of-technology-calicut/" className="hover:text-blue-500 transition transform hover:scale-110">
            <FaLinkedinIn size={22} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-800">© 2025 NIT Calicut. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
