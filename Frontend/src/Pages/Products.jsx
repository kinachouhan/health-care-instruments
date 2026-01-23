import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../Redux/product";
import { FiHeart, FiSearch, FiChevronDown } from "react-icons/fi";
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

  // Fetch products
  useEffect(() => {
    dispatch(getAllProduct({ page: 1, limit: 500 }));
  }, [dispatch]);

  // URL → state
  useEffect(() => {
    setSelectedCategories(categoryParam ? [categoryParam] : []);
    setSelectedSubCategories(subCategoryParam ? [subCategoryParam] : []);
    setPage(1);
  }, [categoryParam, subCategoryParam]);

  // Price range
  const prices = products.map((p) => p.price);
  const minPrice = Math.min(...prices, 0);
  const maxPrice = Math.max(...prices, 0);
  const [price, setPrice] = useState(maxPrice);
  useEffect(() => setPrice(maxPrice), [maxPrice]);

  // Page title & description
  const pageTitle = subCategoryParam || categoryParam || "All Products";
  const pageDescription = useMemo(() => {
    if (subCategoryParam) {
      const parentCategory = categoryData.find(c =>
        c.sub?.some(s => s.name === subCategoryParam)
      );
      const subData = parentCategory?.sub?.find(s => s.name === subCategoryParam);
      return subData?.description || `Explore premium ${subCategoryParam} dental products.`;
    } else if (categoryParam) {
      const catData = categoryData.find(c => c.name === categoryParam);
      return catData?.description || `Browse high quality ${categoryParam} dental equipment and supplies.`;
    }
    return "";
  }, [categoryParam, subCategoryParam]);

  // Category data
  const categories = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = new Set();
      map[p.category].add(p.subCategory);
    });

    return Object.keys(map).map((catName) => {
      const data = categoryData.find((c) => c.name === catName);
      return {
        name: catName,
        image: data?.image || "",
        icon: data?.icon || "",
        subcategories: [...map[catName]],
        count: products.filter((p) => p.category === catName).length,
      };
    });
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const catOk = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const subOk = selectedSubCategories.length === 0 || selectedSubCategories.includes(p.subCategory);
      const priceOk = p.price <= price;
      const searchOk = !searchQuery || p.productName.toLowerCase().includes(searchQuery.toLowerCase());
      return catOk && subOk && priceOk && searchOk;
    });
  }, [products, selectedCategories, selectedSubCategories, price, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Handlers
  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const toggleSubCategory = (sub) => {
    setSelectedSubCategories(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setPrice(maxPrice);
    navigate("/products");
  };

  return (
    <div className="bg-[#faf7f3] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm p-6 items-center mb-4">
          <h1 className="text-4xl font-bold">{pageTitle}</h1>
          <p className="text-gray-600 mt-4">{pageDescription}</p>
        </div>

        {/* CATEGORY SCROLL */}
        <div className="py-2">
          <CategoryScrollbar />
        </div>

        {/* TOOLBAR */}
        <div className="flex justify-end items-center my-6">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(page * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} results
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* FILTER SIDEBAR */}
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
            <div className="relative mb-4">
              <input
                placeholder="Find a Category"
                className="w-full border px-4 py-2 rounded-lg"
              />
              <FiSearch className="absolute right-4 top-3 text-gray-400" />
            </div>

            {categories.map((cat) => (
              <div key={cat.name} className="mb-3">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)}
                >
                  <label className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                    />
                    {cat.name}
                  </label>
                  <FiChevronDown />
                </div>

                {openCategory === cat.name && selectedCategories.includes(cat.name) && (
                  <div className="ml-6 mt-2 space-y-2">
                    {cat.subcategories.map((subName) => {
                      const subData = categoryData.find(c => c.name === cat.name)?.sub.find(s => s.name === subName);
                      return (
                        <label key={subName} className="flex gap-2 items-center text-sm">
                          <input
                            type="checkbox"
                            checked={selectedSubCategories.includes(subName)}
                            onChange={() => toggleSubCategory(subName)}
                          />
                          {subData?.image && (
                            <img
                              src={subData.image}
                              alt={subName}
                              className="w-6 h-6 object-contain rounded"
                            />
                          )}
                          <span>{subName}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={clearFilters}
              className="w-full mt-6 bg-sky-600 text-white py-2 rounded-lg"
            >
              Clear Filters
            </button>
          </aside>

          {/* PRODUCTS */}
          <section className="md:col-span-3">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((p) => {
                  const inStock = p.availableStock > 0; // 🔹 check stock
                  return (
                    <div
                      key={p._id}
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="bg-white rounded-2xl shadow-md p-4 relative transform transition-transform duration-500 ease-in-out hover:scale-105"
                    >
                      <button className="absolute hover:text-red-500 top-4 right-4">
                        <FiHeart />
                      </button>

                      <div className="h-40 flex items-center justify-center">
                        <img
                          src={p.images?.[0]}
                          className="h-full object-contain transform transition-transform duration-500 ease-in-out hover:scale-90"
                          alt={p.productName}
                        />
                      </div>

                      <h3 className="text-sm font-medium mt-3 line-clamp-2">{p.productName}</h3>
                      <div className="flex items-center gap-1 text-sm mt-1">
                        <FaStar className="text-yellow-400" /> 5 (2)
                      </div>

                      <p className="text-red-500 font-semibold mt-2">₹{p.price}</p>

                      {/* 🔹 Out of Stock */}
                      {!inStock && (
                        <p className="text-white bg-red-500 text-xs font-semibold mt-1 px-2 py-1 rounded inline-block">
                          Out of Stock
                        </p>
                      )}

                      <button
                        className={`mt-3 w-full py-2 rounded-lg text-white ${
                          inStock ? "bg-sky-600 hover:bg-red-500" : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!inStock}
                      >
                        Add to Cart
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
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
                    className={`px-4 py-2 rounded ${page === pNum ? "bg-sky-600 text-white" : "bg-gray-200"}`}
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
