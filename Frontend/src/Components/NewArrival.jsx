import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";


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

export const NewArrival = ({ limit = 6 }) => {
  const { products = [], loading } = useSelector((state) => state.product);
  const navigate = useNavigate();


  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const newArrivals = sortedProducts.slice(0, limit);

  if (loading) return <div className="flex items-center justify-center h-screen w-full">
  <div className="w-16 h-16 border-4 border-gray-300 border-t-sky-500 rounded-full animate-spin"></div>
</div>
;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">New Arrivals</h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-orange-500 text-white px-3 py-1 rounded cursor-pointer"
        >
          VIEW ALL
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto scrollbar-hide py-2">
        {newArrivals.map((p) => {
          const { selling, original } = getPrices(p.price);

          const discount =
            original > selling
              ? Math.round(((original - selling) / original) * 100)
              : 0;

          return (
            <div
              key={p._id}
              className="flex-shrink-0 w-48 bg-white shadow-md p-5 relative cursor-pointer transform transition-transform duration-500 ease-in-out hover:scale-105"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              <button className="absolute top-3 right-3 hover:text-red-500">
                <FiHeart />
              </button>

              <div className="h-40 flex items-center justify-center">
                <img
                  src={p.images?.[0]}
                  alt={p.productName}
                  className="h-full object-contain"
                />
              </div>

              <h3 className="text-sm font-medium mt-2 line-clamp-2">
                {p.productName}
              </h3>

              <div className="flex items-center gap-2 mt-1 text-sm">
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
    </div>
  );
};
