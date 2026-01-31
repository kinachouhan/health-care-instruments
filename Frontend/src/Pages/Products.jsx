import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../Redux/product";
import { FiHeart, FiChevronDown } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import categoryData from "../Jsondata/category.json";
import { CategoryScrollbar } from "../Components/CategoryScrollbar";

export const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [], loading } = useSelector((state) => state.product);

  const [openCategory, setOpenCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [page, setPage] = useState(1);

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const subCategoryParam = searchParams.get("subcategory");
  const searchQuery = searchParams.get("search") || "";

  const ITEMS_PER_PAGE = 20;

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


  useEffect(() => {
    dispatch(getAllProduct({ page: 1, limit: 500 }));
  }, [dispatch]);

 
  useEffect(() => {
    setSelectedCategories(categoryParam ? [categoryParam] : []);
    setSelectedSubCategories(subCategoryParam ? [subCategoryParam] : []);
    setPage(1);
  }, [categoryParam, subCategoryParam]);

  const prices = products.map((p) => getPrices(p.price).selling);
  const minPrice = Math.min(...prices, 0);
  const maxPrice = Math.max(...prices, 0);

  const [price, setPrice] = useState(maxPrice);
  useEffect(() => setPrice(maxPrice), [maxPrice]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const { selling } = getPrices(p.price);

      const catOk =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category);

      const subOk =
        selectedSubCategories.length === 0 ||
        selectedSubCategories.includes(p.subCategory);

      const priceOk = selling <= price;

      const searchOk =
        !searchQuery ||
        p.productName.toLowerCase().includes(searchQuery.toLowerCase());

      return catOk && subOk && priceOk && searchOk;
    });
  }, [products, selectedCategories, selectedSubCategories, price, searchQuery]);


  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-[#faf7f3] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8">

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h1 className="text-4xl font-bold">
            {subCategoryParam || categoryParam || "All Products"}
          </h1>
        </div>

        <CategoryScrollbar />

        <div className="flex justify-end items-center my-6">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(page * ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
            {filteredProducts.length} results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <aside className="md:col-span-1 bg-white rounded-2xl shadow-md p-6 h-fit sticky top-32">
            <h3 className="font-semibold mb-4">Filter By Price</h3>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={price}
              onChange={(e) => setPrice(+e.target.value)}
              className="w-full accent-sky-600"
            />
            <p className="text-sm mt-2">₹{minPrice} – ₹{price}</p>

            <h3 className="font-semibold mt-8 mb-3">Filter By Category</h3>

            {categoryData.map((cat) => (
              <div key={cat.name} className="mb-3">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setOpenCategory(openCategory === cat.name ? null : cat.name)
                  }
                >
                  <label className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() =>
                        setSelectedCategories((prev) =>
                          prev.includes(cat.name)
                            ? prev.filter((c) => c !== cat.name)
                            : [...prev, cat.name]
                        )
                      }
                    />
                    {cat.name}
                  </label>
                  <FiChevronDown />
                </div>

                {openCategory === cat.name &&
                  selectedCategories.includes(cat.name) && (
                    <div className="ml-6 mt-2 space-y-2">
                      {cat.sub?.map((sub) => (
                        <label key={sub.name} className="flex gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedSubCategories.includes(sub.name)}
                            onChange={() =>
                              setSelectedSubCategories((prev) =>
                                prev.includes(sub.name)
                                  ? prev.filter((s) => s !== sub.name)
                                  : [...prev, sub.name]
                              )
                            }
                          />
                          {sub.name}
                        </label>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </aside>

          <section className="md:col-span-3">
            {loading ? (
              <p>Loading...</p>
            ) : paginatedProducts.length === 0 ? (
              <div className="bg-white h-screen justify-center flex items-center flex-col rounded-2xl shadow-md p-10 text-center">
                <h2 className="text-xl font-semibold text-gray-700">
                  No products available
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Try selecting a different category or adjusting filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((p) => {
                  const inStock = p.availableStock > 0;
                  const { selling, original } = getPrices(p.price);

                  return (
                    <div
                      key={p._id}
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="bg-white rounded-2xl shadow-md p-4 relative hover:scale-105 transition cursor-pointer"
                    >
                      <button className="absolute top-4 right-4">
                        <FiHeart />
                      </button>

                      <div className="h-40 flex items-center justify-center">
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
                        <FaStar className="text-yellow-400" /> 5 (2)
                      </div>

                      <div className="mt-1">
                        <span className="text-red-500 font-semibold">
                          ₹{selling}
                        </span>
                        {original > selling && (
                          <span className="line-through text-gray-400 text-sm ml-2">
                            ₹{original}
                          </span>
                        )}
                      </div>

                      <button
                        disabled={!inStock}
                        className={`mt-3 w-full py-2 rounded-lg text-white ${inStock
                            ? "bg-sky-600 hover:bg-red-500"
                            : "bg-gray-400 cursor-not-allowed"
                          }`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

         
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`px-4 py-2 rounded ${page === pNum
                        ? "bg-sky-600 text-white"
                        : "bg-gray-200"
                      }`}
                  >
                    {pNum}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
