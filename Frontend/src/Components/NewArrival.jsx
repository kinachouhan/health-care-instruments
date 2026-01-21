
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

export const NewArrival = ({ limit = 6 }) => {
  const { products = [], loading } = useSelector((state) => state.product);
  const navigate = useNavigate();
   

  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  
  const newArrivals = sortedProducts.slice(0, limit);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">New Arrivals</h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-orange-500 text-white px-3 py-1 rounded cursor-pointer "
        >
          VIEW ALL
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto scrollbar-hide py-2">
        {newArrivals.map((p) => (
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
              <span className="line-through text-gray-400">
                ₹{p.originalPrice || p.price}
              </span>
              <span className="text-red-500 font-semibold">₹{p.price}</span>
              {p.originalPrice && (
                <span className="text-green-600 font-medium">
                  {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% off
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
