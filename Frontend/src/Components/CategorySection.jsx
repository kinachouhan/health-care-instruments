import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const getPrices = (price) => {
  if (typeof price === "number") {
    return { selling: price, original: price };
  }

  if (typeof price === "object" && price !== null) {
    return {
      selling: price.selling ?? price.original ?? 0,
      original: price.original ?? price.selling ?? 0,
    };
  }

  return { selling: 0, original: 0 };
};

export const CategorySection = ({ title, products }) => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.product);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <section className="mb-12 rounded-2xl px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>

        <button
          onClick={() => navigate(`/products?category=${title}`)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 text-xs sm:text-sm"
        >
          VIEW ALL
        </button>
      </div>

      {/* Products */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto overflow-x-auto scrollbar-hide pb-2">
        {products.slice(0, 6).map((p) => {
          const { selling, original } = getPrices(p.price);

          const discount =
            original > selling
              ? Math.round(((original - selling) / original) * 100)
              : 0;

          return (
            <div
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
                className= "flex-shrink-0 w-40 sm:w-44 md:w-48 bg-white shadow-md p-4 sm:p-5  rounded-lg  relative cursor-pointer   transform transition-transform duration-300  hover:scale-105"
            >
              {/* Wishlist */}
              <FiHeart className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-sm sm:text-base" />

              {/* Image */}
              <div className="h-28 sm:h-32 md:h-36 flex justify-center items-center">
                <img
                  src={p.images?.[0]}
                  alt={p.productName}
                  className="h-full object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-sm font-medium mt-3 line-clamp-2">
                {p.productName}
              </h3>

              {/* Price */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm">
                {original > selling && (
                  <span className="line-through text-gray-400">
                    ₹{original}
                  </span>
                )}

                <span className="text-red-500 font-semibold">
                  ₹{selling}
                </span>

                {discount > 0 && (
                  <span className="text-green-600 font-medium">
                    {discount}% off
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
