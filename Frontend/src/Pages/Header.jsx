import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { Logo } from "../Components/Logo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/auth";
import { useState, useEffect } from "react";
import { fetchCart } from "../Redux/cartSlice";
import { fetchWishList } from "../Redux/wishListSlice";
import { resetCartState } from "../Redux/cartSlice";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  const { isAuthenticated } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);
  const { items: wishItems } = useSelector((state) => state.wishList);

  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    if (isAuthenticated) {
      dispatch(fetchCart(true));
    }
  }, [dispatch, isAuthenticated]);


  const handleLogout = async () => {
    await dispatch(logout());
      dispatch(resetCartState()); 
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const submitSearch = () => {
    if (!searchText.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchText)}`);
  };

  const safeItems = Array.isArray(items) ? items : [];
  const cartCount = safeItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-6">

          <div onClick={() => navigate("/")} className="w-32 md:w-40 cursor-pointer">
            <Logo />
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-lg">
              <CiSearch
                onClick={submitSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer"
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                placeholder="Search dental products..."
                className="w-full rounded-full border py-3 pl-12 pr-20 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                !isAuthenticated ? navigate("/login") : setSidebarOpen(true)
              }
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <CgProfile className="text-2xl text-gray-700" />
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="relative rounded-full p-2 hover:bg-gray-100"
            >
              <FaRegHeart className="text-2xl text-gray-700" />
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {wishItems.length}
              </span>
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="relative rounded-full p-2 hover:bg-gray-100"
            >
              <FaShoppingCart className="text-2xl text-gray-700" />
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {cartCount}
                </span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {isAuthenticated && sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Account</h2>

            <button
              onClick={() => {
                navigate("/profile");
                setSidebarOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Profile
            </button>

            <button
              onClick={() => {
                navigate("/orders");
                setSidebarOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Orders
            </button>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
