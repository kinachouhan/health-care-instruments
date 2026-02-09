import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTools, FaGift, FaTooth, FaCogs, FaSyringe,
  FaSmile, FaTeeth, FaCapsules, FaChild
} from "react-icons/fa";
import { TbPhysotherapist } from "react-icons/tb";
import { MdKeyboardArrowRight, MdOutlineCategory } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import categories from "../Jsondata/category.json";

export const CategoryDropdown = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState("");

  const dropdownRef = useRef(null);

  const iconMap = {
    FaTooth: <FaTooth />,
    FaCogs: <FaCogs />,
    FaTools: <FaTools />,
    FaSyringe: <FaSyringe />,
    FaSmile: <FaSmile />,
    FaTeeth: <FaTeeth />,
    FaCapsules: <FaCapsules />,
    FaGift: <FaGift />,
    FaChild: <FaChild />,
    TbPhysotherapist: <TbPhysotherapist />,
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div ref={dropdownRef}   className="relative inline-block">
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-4 bg-gray-100 flex gap-6 items-center rounded hover:text-sky-600"
      >
        <MdOutlineCategory className="text-xl" />
        All Categories
        <IoIosArrowDown />
      </button>

      {open && (
        <div className="absolute top-full left-0 flex bg-white rounded-md p-2 shadow-lg z-50">

          <div className="flex flex-col">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onClick={() => {
                  navigate(`/products?category=${cat.name}`);
                  setOpen(false);
                }}
                className="flex items-center justify-between p-4 gap-4 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl text-gray-600">
                    {iconMap[cat.icon]}
                  </span>
                  <span>{cat.name}</span>
                </div>
                <MdKeyboardArrowRight />
              </div>
            ))}
          </div>

    
          <div className="w-[800px]">
            <div className="flex items-center px-8 py-4 gap-2">
              <h3 className="text-2xl font-semibold text-sky-600">
                {hoveredCategory?.toUpperCase()}
              </h3>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-5 gap-4 p-4">
              {categories
                .find((c) => c.name === hoveredCategory)
                ?.sub.map((sub) => (
                  <div
                    key={sub.name}
                    onClick={() => {
                      navigate(
                        `/products?category=${hoveredCategory}&subcategory=${sub.name}`
                      );
                      setOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="bg-white shadow-md rounded-full p-2">
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <p className="text-sm text-center">{sub.name}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
