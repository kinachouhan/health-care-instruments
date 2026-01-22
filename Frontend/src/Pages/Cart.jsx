import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, addToCart, clearCart } from "../Redux/cartSlice.js";
import { MdDelete } from "react-icons/md";

export const Cart = () => {
  const { items, cartLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Total price
  const totalPrice = items.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  if (!cartLoading && (!items || items.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto my-40">
        <h1 className="text-center text-gray-600 text-3xl py-10">Your cart is empty 🛒</h1>
        <div className="text-center">
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-t border-gray-200 py-8 flex flex-col">
        <h1 className="text-gray-500 font-semibold text-xl mb-8">
          My <span className="text-black">CART</span>
        </h1>

        {/* CART ITEMS */}
        <div className="flex flex-col gap-6">
          {items.map((item, index) => (
            <div
              key={item.product?._id || `deleted-${index}`}
              className="flex flex-col sm:flex-row sm:justify-between gap-4 border border-gray-300 p-4 rounded"
            >
              {/* LEFT */}
              <div className="flex gap-4">
                <img
                  className="h-24 w-24 object-cover rounded"
                  src={item.product?.images?.[0] || "/placeholder.png"}
                  alt={item.product?.productName || "Product"}
                />
                <div className="flex flex-col gap-2">
                  <h1 className="font-semibold">
                    {item.product?.productName || "Deleted Product"}
                  </h1>
                  <h1>${item.product?.price || 0}</h1>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex justify-between sm:justify-end items-center gap-6">
                <div className="flex items-center gap-3">
                  <button
                    className="border px-3 py-1 cursor-pointer"
                    disabled={cartLoading}
                    onClick={() => {
                      if (item.quantity === 1) {
                        dispatch(removeFromCart({ productId: item.product._id }));
                      } else {
                        dispatch(addToCart({ productId: item.product._id, quantity: -1 }));
                      }
                    }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="border px-3 py-1 cursor-pointer"
                    disabled={cartLoading}
                    onClick={() =>
                      dispatch(addToCart({ productId: item.product._id, quantity: 1 }))
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="text-2xl text-red-600 cursor-pointer"
                  disabled={cartLoading}
                  onClick={() =>
                    dispatch(removeFromCart({ productId: item.product._id }))
                  }
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CART SUMMARY */}
        <div className="flex justify-end my-10 border-t border-gray-400 py-12">
          <div className="w-full sm:w-auto flex flex-col gap-4">
            <div>
              <h1 className="font-bold text-3xl">Cart Totals</h1>
            </div>
            <div className="flex flex-col gap-2">
             <h1 className="flex  font-semibold justify-between text-gray-700 border-b border-gray-200 py-2"> Subtotal: <span className="">₹{totalPrice.toFixed(2)}</span></h1>
             <h1 className="font-semibold">Shipping</h1>
             <h1>Free Shipping</h1>
             <h1 className="flex  font-semibold justify-between text-gray-700 border-t border-gray-200 py-2"> Total: <span className="text-green-600">₹{totalPrice.toFixed(2)}</span></h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                disabled={cartLoading}
                onClick={() => dispatch(clearCart())}
                className="border border-sky-600 hover:bg-sky-600 hover:text-white cursor-pointer px-6 py-2 w-full sm:w-auto"
              >
                Clear Cart
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="bg-sky-600 hover:bg-sky-800 cursor-pointer text-white px-6 py-2 w-full sm:w-auto"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
