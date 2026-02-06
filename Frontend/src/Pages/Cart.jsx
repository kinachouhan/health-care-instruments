import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, addToCart, clearCart } from "../Redux/cartSlice.js";
import { MdDelete } from "react-icons/md";


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

export const Cart = () => {
  const { items, cartLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isAuthenticated)

  const totalPrice = items.reduce((total, item) => {
    const { selling } = getPrices(item.product?.price);
    return total + selling * item.quantity;
  }, 0);

  if (!cartLoading && (!items || items.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto my-40">
        <h1 className="text-center text-gray-600 text-3xl py-10">
          Your cart is empty 🛒
        </h1>
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

        <div className="flex flex-col gap-6">
          {items.map((item, index) => {
            const { selling, original } = getPrices(item.product?.price);
            const discount =
              original > selling
                ? Math.round(((original - selling) / original) * 100)
                : 0;

            return (
              <div
                key={item.product?._id || `deleted-${index}`}
                className="flex flex-col sm:flex-row sm:justify-between gap-4 border border-gray-300 p-4 rounded"
              >

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

                    <div className="flex items-center gap-2">
                      {original > selling && (
                        <span className="line-through text-gray-400">
                          ₹{original}
                        </span>
                      )}
                      <span className="text-red-500 font-semibold">
                        ₹{selling}
                      </span>
                      {discount > 0 && (
                        <span className="text-green-600 font-medium">
                          {discount}% off
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between sm:justify-end items-center gap-6">
                  <div className="flex items-center gap-3">
                    <button
                      className="border px-3 py-1"
                      disabled={cartLoading}
                      onClick={() => {
                        if (item.quantity === 1) {
                          dispatch(
                            removeFromCart({
                              productId: item.product._id,
                              isLoggedIn,
                            })
                          );
                        } else {
                          dispatch(
                            addToCart({
                              product: item.product,
                              quantity: -1,
                              isLoggedIn,
                            })
                          );
                        }
                      }}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="border px-3 py-1"
                      disabled={cartLoading}
                      onClick={() =>
                        dispatch(
                          addToCart({
                            product: item.product,
                            quantity: 1,
                            isLoggedIn
                          })
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="text-2xl text-red-600"
                    disabled={cartLoading}
                    onClick={() =>
                      dispatch(
                        removeFromCart({ productId: item.product._id, isLoggedIn })
                      )
                    }
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            );
          })}
        </div>


        <div className="flex justify-end my-10 border-t border-gray-400 py-12">
          <div className="w-full sm:w-auto flex flex-col gap-4">
            <h1 className="font-bold text-3xl">Cart Totals</h1>

            <div className="flex flex-col gap-2">
              <h1 className="flex justify-between font-semibold border-b py-2">
                Subtotal: <span>₹{totalPrice.toFixed(2)}</span>
              </h1>

              <h1 className="font-semibold">Shipping</h1>
              <h1>Free Shipping</h1>

              <h1 className="flex justify-between font-semibold border-t py-2">
                Total:
                <span className="text-green-600">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                disabled={cartLoading}
                onClick={() => dispatch(clearCart(isLoggedIn))}
                className="border border-sky-600 hover:bg-sky-600 hover:text-white px-6 py-2"
              >
                Clear Cart
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="bg-sky-600 hover:bg-sky-800 text-white px-6 py-2"
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
