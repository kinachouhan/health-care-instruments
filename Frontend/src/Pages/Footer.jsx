import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Logo } from "../Components/Logo";
import {Link} from "react-router-dom"

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-15">

                {/* Brand & About */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white flex-shrink-0">
                        <div className="w-40 md:w-40">
                            <Logo className="w-full h-auto" />
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Innovation with Care. Transforming smiles and harmonizing health with state-of-the-art dental products and holistic dental care.
                    </p>
                    {/* Social Icons */}
                    <div className="flex gap-4 mt-2">
                        <a href="#" className="hover:text-blue-400"><FaFacebookF /></a>
                        <a href="#" className="hover:text-blue-400"><FaInstagram /></a>
                        <a href="#" className="hover:text-blue-400"><FaTwitter /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-semibold mb-2">TOP CATEGORIES</h3>
                    <Link  to="/" className="hover:text-blue-400 transition text-gray-400">Equipment</Link>
                    <Link to="/about" className="hover:text-blue-400 transition text-gray-400">Orthodontics</Link>
                    <Link to="/contact" className="hover:text-blue-400 transition text-gray-400">Restorative</Link>
                    <Link to="/cart" className="hover:text-blue-400 transition text-gray-400">Instruments</Link>
                    <Link to="/wishlist" className="hover:text-blue-400 transition text-gray-400">Endodontics</Link>
                    <Link to="/wishlist" className="hover:text-blue-400 transition text-gray-400">Impression</Link>
                </div>


                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-semibold mb-2">USEFUL LINKS</h3>
                    <Link  to="/" className="hover:text-blue-400 transition text-gray-400">Home</Link>
                    <Link to="/about" className="hover:text-blue-400 transition text-gray-400">About Us</Link>
                    <Link to="/contact" className="hover:text-blue-400 transition text-gray-400">Contact Us</Link>
                    <Link to="/cart" className="hover:text-blue-400 transition text-gray-400">Cart</Link>
                    <Link to="/wishlist" className="hover:text-blue-400 transition text-gray-400">Wishlist</Link>
                    <Link to="/wishlist" className="hover:text-blue-400 transition text-gray-400">Terms & Conditions</Link>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-semibold mb-2">REGISTERED OFFICIAL ADDRESS</h3>
                    <h1 className="text-white font bold">Care Next Innovation with Care</h1>
                    <p className="text-gray-400">Email: <a href="mailto:care@nxt.com" className="hover:text-blue-400 transition">mihitenterprises18@gmail.com</a></p>
                    <p className="text-gray-400">Phone: <a href="tel:+911234567890" className="hover:text-blue-400 transition">+91 9667292555</a></p>
                    <p className="text-gray-400">Address: <a href="tel:+911234567890" className="hover:text-blue-400 transition">Office #226, 2nd Floor, Oak Tower, Paramount Golfmart, Sector Zeta, Greater Noida</a></p>
                </div>

            </div>

            {/* Bottom */}
            <div className="border-t border-gray-700  p-4 text-center text-gray-500 text-sm">
               <p className="text-gray-400 text-sm mt-4">&copy; 2026 CareNXT. All Rights Reserved.</p>
            </div>
        </footer>
    );
};
