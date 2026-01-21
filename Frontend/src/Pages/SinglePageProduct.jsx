import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { getProductById } from "../Redux/product";
import {
    FaRegHeart,
    FaStar,
    FaTruck,
    FaShieldAlt,
    FaUndo
} from "react-icons/fa";

export const SinglePageProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products, singleProduct: product, loading } = useSelector(
        state => state.product
    );
    const { isAuthenticated } = useSelector(state => state.user) || {};

    const [activeTab, setActiveTab] = useState("description");

    // Safe reviews array
    const reviews = product?.reviews || [];

    // Fetch product on page load / refresh
    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);

    // Reset tab to description when product changes
    useEffect(() => {
        if (product) setActiveTab("description");
    }, [product]);

    // Related products memoization
    const relatedProducts = useMemo(() => {
        if (!product || !products?.length) return [];
        return products.filter(
            p => p.category === product.category && p._id !== product._id
        );
    }, [products, product]);

    if (loading) {
        return <p className="p-10 text-center text-gray-500">Loading product...</p>;
    }

    if (!product) {
        return <p className="p-10 text-center text-gray-500">Product not found</p>;
    }

    return (
        <div className="bg-[#faf7f3] min-h-screen">
            <div className="max-w-[1300px] mx-auto px-4 py-10">

                <nav className="text-sm text-gray-500 mb-8">
                    <span onClick={() => navigate("/")}
                        className="cursor-pointer hover:text-red-500">
                        Home
                    </span>{" "} /{" "}

                    <span onClick={() => navigate("/products?category=${product.category")}
                        className="cursor-pointer hover:text-red-500" >
                        {product.category}
                    </span>{" "} /{" "}
                    <span onClick={() => navigate("/products?subCategory=${product.subCategory")}
                        className="cursor-pointer hover:text-red-500" >
                        {product.subCategory}
                    </span>{" "} /{" "}
                    <span className="font-medium text-gray-700">
                        {product.productName}
                    </span>
                </nav>


                {/* ================= PRODUCT ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-xl">

                    {/* IMAGE */}
                    <div className="relative">
                        <img
                            src={product.images?.[0]}
                            alt={product.productName}
                            className="w-full h-[420px] object-contain transition-transform duration-700 hover:scale-110"
                        />
                        <button className="absolute top-5 right-5 bg-white p-3 rounded-full shadow">
                            <FaRegHeart />
                        </button>
                    </div>

                    {/* DETAILS */}
                    <div>
                        <h1 className="text-3xl font-extrabold">{product.productName}</h1>

                        <div className="flex items-center gap-2 mt-3 text-sm">
                            <FaStar className="text-yellow-400" />
                            5.0 • Verified Reviews
                        </div>

                        <p className="text-3xl font-bold text-red-500 mt-6">₹{product.price}</p>

                        <p className="text-gray-600 mt-6">{product.description}</p>

                        <div className="grid grid-cols-3 gap-4 mt-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <FaTruck /> Fast Delivery
                            </div>
                            <div className="flex items-center gap-2">
                                <FaShieldAlt /> Genuine Product
                            </div>
                            <div className="flex items-center gap-2">
                                <FaUndo /> Easy Returns
                            </div>
                        </div>
                        <div className="my-5 flex gap-4">
                            <button className="px-4 py-2 bg-red-500 text-white w-full hover:bg-white hover:border border-red-500 hover:text-red-500">Add to Cart</button>
                            <button className="w-full px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500  hover:text-white">Buy Now</button>
                        </div>
                    </div>
                </div>

                {/* ================= TABS ================= */}
                <div className="mt-20 bg-white rounded-2xl shadow-xl">

                    {/* TAB HEADER */}
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab("description")}
                            className={`px-8 py-4 font-semibold ${activeTab === "description"
                                ? "border-b-2 border-red-500 text-red-500"
                                : "text-gray-500"
                                }`}
                        >
                            Description
                        </button>

                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`px-8 py-4 font-semibold ${activeTab === "reviews"
                                ? "border-b-2 border-red-500 text-red-500"
                                : "text-gray-500"
                                }`}
                        >
                            Reviews ({reviews.length})
                        </button>
                    </div>

                    {/* TAB CONTENT */}
                    <div className="p-8 min-h-[200px]">
                        {activeTab === "description" && (
                            <div className="text-gray-700 space-y-4">
                                <p>{product.description}</p>
                                <p>
                                    Designed for professional dental use with premium
                                    materials and long-lasting durability.
                                </p>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div>
                                {!isAuthenticated && (
                                    <div className="bg-gray-100 p-4 rounded-lg text-sm mb-4">
                                        Please{" "}
                                        <span
                                            onClick={() => navigate("/login")}
                                            className="font-semibold underline cursor-pointer"
                                        >
                                            login
                                        </span>{" "}
                                        to write a review.
                                    </div>
                                )}

                                {reviews.length === 0 ? (
                                    <p className="text-gray-500">No reviews yet.</p>
                                ) : (
                                    reviews.map(r => (
                                        <div key={r._id} className="border-b py-3">
                                            <div className="flex items-center gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <FaStar
                                                        key={star}
                                                        className={`text-sm ${star <= r.rating ? "text-yellow-400" : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                                <span className="font-semibold">{r.user.name}</span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {new Date(r.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm mt-1">{r.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= RELATED PRODUCTS ================= */}
                {relatedProducts.length > 0 && (
                    <div className="my-20">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Related Products</h2>
                            <button
                                onClick={() => navigate(`/products?category=${product.category}`)}
                                className="text-red-500 font-semibold hover:underline"
                            >
                                View More
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.slice(0, 4).map(p => (
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

                                    <h3 className="text-sm font-medium mt-3 line-clamp-2">
                                        {p.productName}
                                    </h3>

                                    <p className="text-red-500 font-semibold mt-2">
                                        ₹{p.price}
                                    </p>

                                    <button className="mt-3 w-full bg-sky-600 hover:bg-red-500 text-white py-2 rounded-lg">
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        </div >
    );
};



