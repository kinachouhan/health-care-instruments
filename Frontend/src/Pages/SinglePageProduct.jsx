import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FaStar, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import { getProductById } from "../Redux/product";
import { addToCart, removeFromCart } from "../Redux/cartSlice";
import { WishListHeart } from "../Components/WishListHeart";
import toast from "react-hot-toast";

export const SinglePageProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, singleProduct: product, loading } = useSelector(
    (state) => state.product
  );
  const { items: cartItems, cartLoading } = useSelector((state) => state.cart);
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);

  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);



  useEffect(() => {
    if (product) setActiveTab("description");
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product || !products?.length) return [];
    return products.filter(
      (p) => p.category === product.category && p._id !== product._id
    );
  }, [products, product]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
  <div className="w-16 h-16 border-4 border-gray-300 border-t-sky-500 rounded-full animate-spin"></div>
</div>

    );

  if (!product)
    return (
      <p className="p-10 text-center text-gray-500 text-lg">
        Product not found
      </p>
    );

  const inCart = cartItems.some(
    (item) => item.product?._id === product._id
  );

  const handleCartClick = () => {
    if (cartLoading) return;

    if (inCart) {
      dispatch(
        removeFromCart({
          productId: product._id,
          isLoggedIn,
        })
      );
      toast.success("Removed from Cart")
    } else {
      dispatch(
        addToCart({
          product,
          quantity: 1,
          isLoggedIn,
        })
      );
      toast.success("Added to Cart")
    }
  };

  const sellingPrice =
    typeof product.price === "number"
      ? product.price
      : product.price?.selling || 0;

  const originalPrice =
    typeof product.price === "number"
      ? product.price
      : product.price?.original || product.price?.selling || 0;


  const inStock = product.availableStock > 0;

   const discount =
            originalPrice > sellingPrice
              ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
              : 0;

  return (
    <div className="bg-[#faf7f3] min-h-screen">
      <div className="max-w-[1300px] mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-10 flex flex-wrap gap-1">
          <span
            onClick={() => navigate("/products")}
            className="cursor-pointer hover:text-red-500 transition"
          >
            Home
          </span>
          /
          <span
            onClick={() => navigate(`/products?category=${product.category}`)}
            className="cursor-pointer hover:text-red-500 transition"
          >
            {product.category}
          </span>
          /
          <span className="font-medium text-gray-700 line-clamp-1">
            {product.productName}
          </span>
        </nav>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 bg-white p-8 md:p-10 rounded-3xl shadow-2xl">
          <div className="relative flex items-center justify-center bg-[#faf7f3] rounded-2xl p-6 overflow-hidden">
            <img
              src={product.images?.[0]}
              alt={product.productName}
              className="w-full h-[420px] object-contain transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute top-4 right-4">
              <WishListHeart product={product} />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                {product.productName}
              </h1>

              <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                <FaStar className="text-yellow-400" />
                <span className="font-medium">5.0</span>
                <span>• Verified Reviews</span>
              </div>

              <div className="mt-8 flex items-end gap-4">
                <span className="text-3xl font-bold text-red-600">
                  ₹{sellingPrice}
                </span>
                {originalPrice > sellingPrice && (
                  <span className="text-gray-400 text-xl line-through">
                    ₹{originalPrice}
                  </span>
                )}
                 {discount > 0 && (
                  <span className="text-green-600 font-medium">
                    {discount}% off
                  </span>
                )}
              </div>

              <p className="text-gray-600 mt-6 leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-10 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaTruck className="text-red-500" /> Fast Delivery
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-red-500" /> Genuine
                </div>
                <div className="flex items-center gap-2">
                  <FaUndo className="text-red-500" /> Easy Returns
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button
                disabled={!inStock}
                onClick={handleCartClick}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300
    ${!inStock
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : inCart
                      ? "bg-gray-500 text-white hover:bg-red-500"
                      : "bg-sky-500 text-white hover:bg-white hover:text-sky-500 border-2 border-sky-500"
                  }
  `}
              >
                {inCart ? "Remove from Cart" : "Add to Cart"}
              </button>


              <button
                disabled={!inStock}
                onClick={() => inStock && navigate("/checkout")}
                className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all duration-300
    ${inStock
                    ? "border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white"
                    : "border-gray-400 text-gray-400 cursor-not-allowed bg-gray-100"
                  }
  `}
              >
                Buy Now
              </button>

            </div>
          </div>
        </div>

        <div id="product-tabs" className="mt-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Product Details
          </h2>

          <div className=" pt-4">
            <div className="">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-3 px-6 text-sm  font-semibold transition border border-gray-200 ${activeTab === "description"
                  ? "bg-sky-500 text-white"
                  : "text-gray-700 hover:text-gray-800"
                  }`}
              >
                Description
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-3 px-6 text-sm font-semibold transition border border-gray-200 ${activeTab === "reviews"
                  ? "bg-sky-500 text-white"
                  : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                Reviews (0)
              </button>
            </div>
            <div className=" border p-5 border-gray-300">
              {activeTab === "description" && (
                <div className="bg-white rounded-xl shadow-sm p-5 space-y-5 text-gray-700 leading-relaxed">
                  <p>
                    {product.description ||
                      "This premium dental product is engineered for professional accuracy, durability, and long-term clinical use."}
                  </p>

                  <p className="text-sm text-gray-600">
                    Designed for clinics, hospitals, and dental labs using high-quality
                    materials to ensure hygiene, reliability, and safety standards.
                  </p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {!isLoggedIn && (
                    <div className="bg-gray-50 border border-gray-200 p-4 bg-yellow-50 rounded-lg text-sm">
                      <span className="font-semibold">Note: </span>
                      Please{" "}
                      <span
                        onClick={() => navigate("/login")}
                        className="text-sky-500 font-semibold cursor-pointer underline"
                      >
                        login
                      </span>{" "}
                      to write a review. Only verified purchasers can submit reviews.
                    </div>
                  )}

                  {/* Future reviews go here */}
                </div>
              )}
            </div>
          </div>
        </div>


        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="my-24">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <button
                onClick={() => navigate("/products")}
                className="text-red-500 hover:underline font-bold"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {relatedProducts.slice(0, 5).map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer"
                >
                  <img
                    src={p.images?.[0]}
                    className="h-40 mx-auto object-contain"
                    alt={p.productName}
                  />
                  <h3 className="text-sm font-semibold mt-4 line-clamp-2">
                    {p.productName}
                  </h3>
                  <p className="text-red-500 font-semibold mt-2">
                    ₹{typeof p.price === "number" ? p.price : p.price?.selling}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
