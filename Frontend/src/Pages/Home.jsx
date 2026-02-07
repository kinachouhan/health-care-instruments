
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
    <div className="mb-20">
      <div className=" bg-gradient-to-r from-sky-50 to-white  mx-auto px-4 text-center sm:py-30">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Premium Dental Products, Trusted by Professionals
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Shop top-quality dental tools, hygiene kits, and cosmetic care essentials — all in one place.
        </p>
        <a
          href="/products"
          className="inline-block bg-sky-500 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-full shadow-md transition"
        >
          Shop Now
        </a>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        <TopCategory />
      </div>
      <div className="bg-green-50 my-10">
        <NewArrival limit={6} />
      </div>
      <div className="bg-[#faf7f3]">
        <div className=" min-h-screen px-4 py-10 max-w-7xl mx-auto">
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
