import categories from "../Jsondata/category.json";
import { useNavigate } from "react-router-dom";

export const TopCategory = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold">
          Top Categories
        </h2>

        <button
          onClick={() => navigate("/products")}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-1.5 rounded-md transition"
        >
          VIEW ALL
        </button>
      </div>

      {/* Categories - Scrollable on ALL devices */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">

        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/products?category=${cat.name}`);
            }}
            className="flex-shrink-0 flex flex-col items-center text-center cursor-pointer group min-w-[90px] md:min-w-[110px]"
          >
            
            {/* Circle Image */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-gray-200 group-hover:scale-105 transition duration-300">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <span className="mt-2 text-xs md:text-sm font-medium text-gray-700 group-hover:text-blue-600 transition whitespace-nowrap">
              {cat.name}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};
