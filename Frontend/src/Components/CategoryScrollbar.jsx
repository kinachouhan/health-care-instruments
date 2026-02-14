import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import categoryData from "../Jsondata/category.json";

export const CategoryScrollbar = () => {
  const navigate = useNavigate();
  const swiperRef = useRef();

  const allItems = [
    ...categoryData.map((c) => ({ ...c, isSub: false })), 
    ...categoryData.flatMap((c) =>
      c.sub.map((s) => ({ ...s, parent: c.name, isSub: true }))
    ),
  ];

  return (
    <div className="relative group ">
   
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
      >
        &#8592;
      </button>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
      >
        &#8594;
      </button>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView="auto"
        loop={true} 
        className="py-4"
      >
        {allItems.map((item, idx) => (
          <SwiperSlide
            key={idx}
            style={{ width: "auto" }}
            className="flex-shrink-0"
          >
            <button
              onClick={() =>
                navigate(
                  `/products?category=${item.isSub ? item.parent : item.name}${
                    item.isSub ? `&subcategory=${item.name}` : ""
                  }`
                )
              }
              className={`w-53 flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition`}
            >
              <div className="flex flex-shrink-0 items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full"
                />
              </div>
              <span className="w-full font-medium">
                {item.isSub ? ` ${item.name}` : item.name}
              </span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
