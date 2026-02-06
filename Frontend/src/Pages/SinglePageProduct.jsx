import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FaStar, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import { getProductById } from "../Redux/product";
import { addToCart, removeFromCart } from "../Redux/cartSlice";
import { WishListHeart } from "../Components/WishListHeart";
import { fetchWishList } from "../Redux/wishListSlice";

export const SinglePageProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, singleProduct: product, loading } = useSelector(
    (state) => state.product
  );
  const { items, cartLoading } = useSelector((state) => state.cart);
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);


  console.log(items)

  const [activeTab, setActiveTab] = useState("description");
  const reviews = product?.reviews || [];

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchWishList());
  }, [dispatch]);

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
    return <p className="p-10 text-center text-gray-500">Loading product...</p>;
  if (!product)
    return <p className="p-10 text-center text-gray-500">Product not found</p>;

  const inCart = items.some((item) => item.product?._id === product._id);

  const handleCartClick = () => {
    if (cartLoading) return;

    if (inCart) {
      dispatch(
        removeFromCart({
          productId: product._id,
          isLoggedIn,
        })
      );
    } else {
      dispatch(
        addToCart({
          product,
          quantity: 1,
          isLoggedIn,
        })
      );
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

  return (
    <div className="bg-[#faf7f3] min-h-screen">
      <div className="max-w-[1300px] mx-auto px-4 py-10">


        <nav className="text-sm text-gray-500 mb-8">
          <span onClick={() => navigate("/")} className="cursor-pointer hover:text-red-500">
            Home
          </span>{" "}
          /{" "}
          <span
            onClick={() => navigate(`/products?category=${product.category}`)}
            className="cursor-pointer hover:text-red-500"
          >
            {product.category}
          </span>{" "}
          /{" "}
          <span className="font-medium text-gray-700">{product.productName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-xl">

          <div className="relative">
            <img
              src={product.images?.[0]}
              alt={product.productName}
              className="w-full h-[420px] object-contain hover:scale-110 transition"
            />
            <div className="absolute top-3 right-3">
              <WishListHeart productId={product._id} />
            </div>
          </div>


          <div>
            <h1 className="text-3xl font-extrabold">{product.productName}</h1>

            <div className="flex items-center gap-2 mt-3 text-sm">
              <FaStar className="text-yellow-400" /> 5.0 • Verified Reviews
            </div>

            <div className="mt-6 text-3xl font-bold text-red-500 flex items-center gap-4">
              <span>₹{sellingPrice}</span>
              {originalPrice > sellingPrice && (
                <span className="text-gray-400 text-xl line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>

            <p className="text-gray-600 mt-6">{product.description}</p>

            <div className="grid grid-cols-3 gap-4 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2"><FaTruck /> Fast Delivery</div>
              <div className="flex items-center gap-2"><FaShieldAlt /> Genuine</div>
              <div className="flex items-center gap-2"><FaUndo /> Easy Returns</div>
            </div>


            <div className="my-5 flex gap-4">
              <button
                onClick={handleCartClick}
                disabled={cartLoading}
                className={`w-full px-4 py-2 rounded-lg text-white font-semibold ${inCart
                    ? "bg-gray-500 hover:bg-red-600"
                    : "bg-red-500 hover:bg-white hover:text-red-500 border hover:border-red-500"
                  }`}
              >
                {inCart ? "Remove from Cart" : "Add to Cart"}
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-semibold"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>


        {relatedProducts.length > 0 && (
          <div className="my-20">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((p) => {
                const relatedSelling =
                  typeof p.price === "number" ? p.price : p.price?.selling;

                const relatedOriginal =
                  typeof p.price === "number" ? p.price : p.price?.original;

                return (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/product/${p._id}`)}
                    className="bg-white p-4 rounded-2xl shadow hover:scale-105 transition"
                  >
                    <img
                      src={p.images?.[0]}
                      className="h-40 mx-auto object-contain"
                      alt={p.productName}
                    />

                    <h3 className="text-sm mt-3 line-clamp-2">{p.productName}</h3>

                    <p className="text-red-500 font-semibold mt-2">
                      ₹{relatedSelling}{" "}
                      {relatedOriginal > relatedSelling && (
                        <span className="line-through text-gray-400 text-sm">
                          ₹{relatedOriginal}
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
