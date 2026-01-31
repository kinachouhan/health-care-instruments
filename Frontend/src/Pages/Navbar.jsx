import { NavLink } from "react-router-dom";
import { CategoryDropdown } from "../Components/CategoryDropDown.jsx";

export const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `hover:text-sky-600 transition ${
      isActive
        ? "text-sky-600 border-b-2 border-sky-600 pb-1"
        : "text-gray-700"
    }`;

  return (
    <nav className="sticky top-18 w-full bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto flex justify-around items-center text-sm font-medium h-14">
        <div className="flex items-center">
          <CategoryDropdown />
        </div>

        <NavLink to="/products" className={linkClass}>
          All Products
        </NavLink>

        <NavLink to="/about" className={linkClass}>
          About Us
        </NavLink>
        <NavLink to="/contact" className={linkClass}>
          Contact Us
        </NavLink>

      </div>
    </nav>
  );
};
