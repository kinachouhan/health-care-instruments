
import { NavLink } from "react-router-dom";
import { Logo } from "../Components/Logo";
import {logout} from "../Redux/auth"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export const AdminHeader = () => {
    
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = async()=>{
      await dispatch(logout())
      navigate("/login")
  }

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <span className="w-20 sm:w-10 md:w-30">
            <Logo className="w-full h-auto" />
          </span>
        </div>

        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
          Admin Panel
        </p>

        <button
        onClick={handleLogout}
         className="cursor-pointer bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base px-4 py-2 rounded-lg transition">
          Logout
        </button>

      </div>

      <div>
        <nav className="bg-gray-50 border-t border-gray-500">
          <div className="max-w-7xl mx-auto p-2 flex justify-around  overflow-x-auto">

            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap
              ${isActive
                  ? "bg-sky-400 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`
              }
            >
              Add Product
            </NavLink>

            <NavLink
              to="list"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap
              ${isActive
                  ? "bg-sky-400 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50/5 hover:text-blue-600"}`
              }
            >
              Product List
            </NavLink>

            <NavLink
              to="all-orders"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap
              ${isActive
                  ? "bg-sky-400 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`
              }
            >
              Orders
            </NavLink>

            <NavLink
              to="all-users"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap
              ${isActive
                  ? "bg-sky-400 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`
              }
            >
              All Users
            </NavLink>

          </div>
        </nav>
      </div>
    </header>
  );
};
