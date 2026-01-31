import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

  return (
    <section className="mb-12 rounded-2xl p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>

        <button
          onClick={() => navigate(`/products?category=${title}`)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 cursor-pointer text-sm"
        >
          VIEW ALL
        </button>
      </div>

      <div className="flex gap-6 flex-shrink-0 overflow-x-auto no-scrollbar pb-2">
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
              className="relative min-w-[220px] bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:scale-105 transition"
            >
              <FiHeart className="absolute top-3 right-3 text-gray-400 hover:text-red-500" />

              <div className="h-36 flex justify-center items-center">
                <img
                  src={p.images?.[0]}
                  alt={p.productName}
                  className="h-full object-contain"
                />
              </div>

              <h3 className="text-sm font-medium mt-3 line-clamp-2">
                {p.productName}
              </h3>

              <div className="flex items-center gap-1 text-sm mt-1">
                <FaStar className="text-yellow-400" />
                5 (2)
              </div>

              <div className="flex items-center gap-2 mt-2 text-sm">
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
