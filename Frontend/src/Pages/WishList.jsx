import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaHeartBroken } from "react-icons/fa";
import { removeFromWishList, clearWishList } from "../Redux/wishListSlice";

export const WishList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, wishListLoading } = useSelector((state) => state.wishList);

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <FaHeartBroken className="text-6xl mb-4 text-red-400" />
        <p className="text-lg font-medium">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pb-40">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My Wishlist ❤️
        </h1>

        <button
          disabled={wishListLoading}
          onClick={() => dispatch(clearWishList())}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600  hover:bg-sky-800 transition disabled:opacity-50"
        >
          <FaTrashAlt />
          Clear Wishlist
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 pt-8 gap-6">
        {items.map((item) => {
          const product = item.product;

          return (
            <div
              key={product._id}
              className="relative bg-white rounded-xl shadow hover:shadow-xl transition group"
            >
              {/* REMOVE SINGLE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeFromWishList({ productId: product._id }));
                }}
                className="absolute top-3 right-3 z-10 p-2 text-red-500 rounded-full bg-white shadow hover:bg-red-500 hover:text-white transition"
              >
                <FaTrashAlt className="text-sm" />
              </button>

              {/* CARD CLICK */}
              <div
                onClick={() => navigate(`/product/${product._id}`)}
                className="cursor-pointer p-4 py-8"
              >
                <div className="h-40 flex items-center justify-center">
                  <img
                    src={product.images?.[0]}
                    alt={product.productName}
                    className="h-full object-contain transition-transform group-hover:scale-105"
                  />
                </div>

                <h3 className="text-sm font-medium mt-4 line-clamp-2 text-gray-800">
                  {product.productName}
                </h3>

                <p className="text-red-500 font-semibold mt-2">
                  ₹{product.price}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
