import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { Logo } from "../Components/Logo";
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/auth"
import { useState } from "react";

export const Header = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isAuthenticated } = useSelector((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout())
    navigate("/login")
  }


  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-32 md:w-40">
              <Logo className="w-full h-auto" />
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-lg">
              <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search dental products..."
                className="w-full rounded-full border border-gray-300 py-3 pl-12 pr-20 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>

          {/* Icons */}
          <div 
          onMouseEnter={() => isAuthenticated && setShowDropdown(true)} 
          onMouseLeave={() => setShowDropdown(false)}
          className="flex items-center gap-3 relative">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login");
                }
              }}
              onMouseEnter={() => isAuthenticated && setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              className="rounded-full p-2 hover:bg-gray-100 hover:text-sky-600 transition">
              <CgProfile className="text-2xl text-gray-700" />
            </button>

            {/* Dropdown (only if logged in) */}
            {isAuthenticated && showDropdown && (
              <div className="absolute top-6 right-0 w-40 bg-white shadow-lg rounded-lg py-2">
                <button onClick={() => navigate("/profile")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </button>
                <button onClick={() => navigate("/orders")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Orders
                </button>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500" >
                  Logout
                </button>
              </div>
            )}

            <button onClick={() => navigate("/wishlist")} className="relative rounded-full p-2 hover:bg-gray-100 hover:text-sky-600 transition">
              <FaRegHeart className="text-2xl text-gray-700" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white">
                0
              </span>
            </button>

            <button onClick={() => navigate("/cart")} className="relative rounded-full p-2 hover:bg-gray-100 hover:text-sky-600 transition">
              <FaShoppingCart className="text-2xl text-gray-700" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3">
          <div className="relative">
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search dental products..."
              className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
