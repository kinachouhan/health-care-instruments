import { NavLink } from "react-router-dom";
import { CategoryDropdown } from "../Components/CategoryDropDown.jsx";
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { Logo } from "../Components/Logo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/auth";
import { useState, useEffect } from "react";
import { fetchCart, resetCartState } from "../Redux/cartSlice";
import { fetchWishList } from "../Redux/wishListSlice";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);
  const { items: wishItems } = useSelector((state) => state.wishList);

  const [searchText, setSearchText] = useState("");
  const [params] = useSearchParams();

  useEffect(() => {
    const q = params.get("search");
    if (q) setSearchText(q);
  }, [params]);

  useEffect(() => {
    dispatch(fetchWishList());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart(true));
  }, [dispatch, isAuthenticated]);

  const submitSearch = () => {
    if (!searchText.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchText)}`);
  };

  const safeItems = Array.isArray(items) ? items : [];
  const cartCount =
    safeItems.length > 0
      ? safeItems.reduce((total, item) => total + (item.quantity || 1), 0)
      : 0;

  const linkClass = ({ isActive }) =>
    `hover:text-sky-600 transition ${
      isActive ? "text-sky-600 font-semibold" : "text-gray-700"
    }`;

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="w-full bg-[#f5f6f8] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* TOP ROW */}
          <div className="flex items-center justify-between h-16">

            {/* Mobile Menu Icon */}
            <button className="md:hidden text-2xl text-gray-700">
              ☰
            </button>

            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="w-32 md:w-40 cursor-pointer"
            >
              <Logo />
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 justify-center px-8">
              <div className="relative w-full max-w-2xl">
                <CiSearch
                  onClick={submitSearch}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                  placeholder="Search dental products..."
                  className="w-full bg-white border border-gray-300 rounded-full py-3 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-6">

              <button
                onClick={() =>
                  !isAuthenticated
                    ? navigate("/login")
                    : navigate("/profile")
                }
                className="hidden md:block text-2xl text-gray-700 hover:text-blue-600"
              >
                <CgProfile />
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                className="relative text-2xl text-gray-700 hover:text-blue-600"
              >
                <FaRegHeart />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center">
                  {wishItems.length}
                </span>
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="relative text-2xl text-gray-700 hover:text-blue-600"
              >
                <FaShoppingCart />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </button>

            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <CiSearch
                onClick={submitSearch}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                placeholder="Search for products"
                className="w-full bg-white border border-gray-300 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ================= DESKTOP NAVBAR ================= */}
      <div className="hidden md:block bg-white border-t border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-around h-14 text-sm font-medium">
            <CategoryDropdown />
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
        </div>
      </div>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md md:hidden z-50">
        <div className="flex justify-around items-center h-16 text-xs text-gray-600">

          <NavLink to="/" className="flex flex-col items-center">
            <span className="text-lg">🏠</span>
            Home
          </NavLink>

          <NavLink to="/products" className="flex flex-col items-center">
            <span className="text-lg">🛍</span>
            Shop
          </NavLink>

          <div className="flex flex-col items-center">
            <span className="text-lg">☰</span>
            Menu
          </div>

          <div className="flex flex-col items-center">
            <span className="text-lg">📂</span>
            Categories
          </div>

          <NavLink to="/profile" className="flex flex-col items-center">
            <span className="text-lg">👤</span>
            Account
          </NavLink>

        </div>
      </div>
    </>
  );
};
