import { NewArrival } from "../Components/NewArrival";
import { TopCategory } from "../Components/TopCategory";
import { useEffect , useMemo} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../Redux/product";
import { CategorySection } from "../Components/CategorySection";

export const Home = () => {
  const dispatch = useDispatch();
  const { products = [] } = useSelector((state) => state.product);

  useEffect(() => {
    if (!products.length) {
      dispatch(getAllProduct({ page: 1, limit: 500 }));
    }
  }, [dispatch, products.length]);

  const productsByCategory = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [products]);

  return (
    <div className="mb-10 sm:mb-16 lg:mb-20">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-50 to-white mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28 text-center">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
          Premium Dental Products, Trusted by Professionals
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-8">
          Shop top-quality dental tools, hygiene kits, and cosmetic care essentials — all in one place.
        </p>

        <a
          href="/products"
          className="inline-block bg-sky-500 hover:bg-gray-800 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-md transition text-sm sm:text-base"
        >
          Shop Now
        </a>
      </div>

      {/* Top Category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <TopCategory />
      </div>

      {/* New Arrival */}
      <div className="bg-green-50 my-8 sm:my-10 lg:my-14 px-4 sm:px-6 lg:px-8">
        <NewArrival limit={6} />
      </div>

      {/* Category Sections */}
      <div className="bg-[#faf7f3]">
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 max-w-7xl mx-auto">
          {Object.entries(productsByCategory).map(
            ([category, items]) =>
              items.length > 0 && (
                <CategorySection
                  key={category}
                  title={category}
                  products={items}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};
