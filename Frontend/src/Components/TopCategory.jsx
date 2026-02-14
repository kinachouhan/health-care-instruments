
import categories from "../Jsondata/category.json";
import { useNavigate } from "react-router-dom"

export const TopCategory = () => {

  const navigate = useNavigate()
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold">Top Categories</h2>
        <button onClick={() => navigate("/products")} className="cursor-pointer bg-orange-500 text-white px-3 py-1 rounded">VIEW ALL</button>
      </div>

      <div className="flex space-x-4 overflow-x-auto justify-between scrollbar-hide py-2">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex flex-col  items-center text-center"
            onClick={() => {
              navigate(`/products?category=${cat.name}`);
              setOpen(false);
            }}
          >
            <div className="w-22 h-22 rounded-full overflow-hidden border-2 border-gray-200 transform transition-transform duration-500 ease-in-out hover:scale-115">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-2 text-sm font-medium">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
