import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const CategorySection = ({ title, products }) => {
  const navigate = useNavigate();

  return (
    <section className="mb-12  rounded-2xl p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>

        <button
          onClick={() => navigate(`/products?category=${title}`)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 cursoe-pointer text-sm"
        >
          VIEW ALL
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="flex gap-6  overflow-x-auto no-scrollbar  pb-2">
        {products.slice(0, 6).map((p) => (
          <div
            key={p._id}
            onClick={() => navigate(`/product/${p._id}`)}
            className="min-w-[220px] bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:scale-105 transition"
          >
            {/* Wishlist */}
            <FiHeart className="absolute text-gray-400 hover:text-red-500" />

            {/* Image */}
            <div className="h-36 flex justify-center items-center">
              <img
                src={p.images?.[0]}
                alt={p.productName}
                className="h-full object-contain"
              />
            </div>

            {/* Name */}
            <h3 className="text-sm font-medium mt-3 line-clamp-2">
              {p.productName}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 text-sm mt-1">
              <FaStar className="text-yellow-400" />
              5 (2)
            </div>

            {/* Price */}
            <p className="text-red-500 font-semibold mt-2">
              ₹{p.price}
            </p>

            {/* Points */}
            <button className="mt-3 w-full border border-red-500 text-sm py-1 rounded-lg">
              ⭐ {Math.floor(p.price / 50)} Points
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
