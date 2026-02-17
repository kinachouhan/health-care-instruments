import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Logo } from "../Components/Logo";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand & About */}
        <div className="flex flex-col gap-4">
          <div className="bg-white w-fit">
            <div className="w-32 sm:w-36 md:w-40">
              <Logo className="w-full h-auto" />
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Innovation with Care. Transforming smiles and harmonizing health 
            with state-of-the-art dental products and holistic dental care.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-2 text-sm sm:text-base">
            <a href="#" className="hover:text-blue-400 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Top Categories */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">
            TOP CATEGORIES
          </h3>

          <Link to="/products?category=Equipment" className="hover:text-blue-400 transition text-gray-400 text-sm">
            Equipment
          </Link>
          <Link to="/products?category=Orthodontics" className="hover:text-blue-400 transition text-gray-400 text-sm">
            Orthodontics
          </Link>
          <Link to="/products?category=Restorative" className="hover:text-blue-400 transition text-gray-400 text-sm">
            Restorative
          </Link>
          <Link to="/products?category=Instruments" className="hover:text-blue-400 transition text-gray-400 text-sm">
            Instruments
          </Link>
          <Link to="/products?category=Endodontics" className="hover:text-blue-400 transition text-gray-400 text-sm">
            Endodontics
          </Link>
          <Link to="/products?category=Impression" className="hover:text-blue-400 transition text-gray-400 text-sm">
            Impression
          </Link>
        </div>

        {/* Useful Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">
            USEFUL LINKS
          </h3>

          <Link to="/" className="hover:text-blue-400 transition text-gray-400 text-sm">
            Home
          </Link>
          <Link to="/about" className="hover:text-blue-400 transition text-gray-400 text-sm">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-blue-400 transition text-gray-400 text-sm">
            Contact Us
          </Link>
          <Link to="/cart" className="hover:text-blue-400 transition text-gray-400 text-sm">
            Cart
          </Link>
          <Link to="/wishlist" className="hover:text-blue-400 transition text-gray-400 text-sm">
            Wishlist
          </Link>
          <Link to="/wishlist" className="hover:text-blue-400 transition text-gray-400 text-sm">
            Terms & Conditions
          </Link>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">
            REGISTERED OFFICIAL ADDRESS
          </h3>

          <h1 className="text-white font-bold text-sm sm:text-base">
            Care Next Innovation with Care
          </h1>

          <p className="text-gray-400 text-sm">
            Email:{" "}
            <a
              href="mailto:mihitenterprises18@gmail.com"
              className="hover:text-blue-400 transition break-all"
            >
              mihitenterprises18@gmail.com
            </a>
          </p>

          <p className="text-gray-400 text-sm">
            Phone:{" "}
            <a
              href="tel:+919667292555"
              className="hover:text-blue-400 transition"
            >
              +91 9667292555
            </a>
          </p>

          <p className="text-gray-400 text-sm leading-relaxed">
            Office #226, 2nd Floor, Oak Tower, Paramount Golfmart,
            Sector Zeta, Greater Noida
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-500 text-sm px-4">
        <p className="text-gray-400">
          &copy; 2026 CareNXT. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
