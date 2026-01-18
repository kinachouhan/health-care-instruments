import { useNavigate } from "react-router-dom";

import { CategoryDropdown } from "../Components/CategoryDropDown.jsx";


export const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-20 w-full bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 flex justify-around gap-6 py-3 text-sm font-medium items-center">
                <div className="flex items-center ">
                   
                    <CategoryDropdown/>
                </div>
                {/* All Products */}
                <button
                    onClick={() => navigate("/products")}
                    className="hover:text-sky-600"
                >
                    All Products
                </button>

                {/* About Us */}
                <button
                    onClick={() => navigate("/about")}
                    className="hover:text-sky-600"
                >
                    About Us
                </button>

                {/* Contact Us */}
                <button
                    onClick={() => navigate("/contact")}
                    className="hover:text-sky-600"
                >
                    Contact Us
                </button>
            </div>
        </nav>
    );
};
