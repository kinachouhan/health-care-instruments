import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTools, FaGift, FaTooth, FaCogs, FaSyringe, FaSmile, FaTeeth, FaCapsules } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineCategory } from "react-icons/md";

export const CategoryDropdown = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState("");


  const categories = [
    // { name: "Offer Zone", icon: <FaGift />, sub: ["Special Deals", "Discounted Kits"] },
    { icon: <FaTooth /> },
    { icon: <FaCogs />},
    { icon: <FaTools />},
    { icon: <FaSyringe />},
    {icon: <FaSmile />},
    { icon: <FaTeeth /> },
    {icon: <FaCapsules />},
    {icon: <FaSmile />},
    {icon: <FaSmile /> },
  ];

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-4 bg-gray-100 flex gap-6 items-center rounded hover:text-sky-600"
      >
        <span className="text-xl"> <MdOutlineCategory /></span>
        All Categories
        <IoIosArrowDown />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute top-full left-0 flex bg-white rounded-sm  shadow-lg z-50">
          {/* Left: Main Categories */}
          <div className="flex flex-col">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onMouseEnter={() => setHoveredCategory(cat.name)}
                className={`flex items-center justify-between p-4 border border-gray-100 gap-4 cursor-pointer hover:text-sky-600 hover:bg-gray-100 ${hoveredCategory === cat.name ? "bg-gray-100 font-semibold" : ""
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl text-gray-600">{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                <MdKeyboardArrowRight className="text-gray-500" />
              </div>
            ))}
          </div>


          {/* Right: Subcategories */}
          <div className="w-full md:w-[700px] border-t">
            <div className="flex gap-2 items-center px-8 py-4">
              <h3 className=" font-semibold text-sky-600 w-auto text-2xl">
                {hoveredCategory}
              </h3>
              <div className="h-[1px] bg-gray-200 w-full flex "></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 px-4">
              {categories
                .find((c) => c.name === hoveredCategory)
                ?.sub.map((sub) => (
                  <div
                    key={sub}
                    onClick={() =>
                      navigate(
                        `/category/${sub.toLowerCase().replace(/\s+/g, "-")}`
                      )
                    }
                    className="py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                  >
                    {sub}
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
