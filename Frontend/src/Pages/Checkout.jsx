import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { placeOrder } from "../Redux/orderSlice";
import { useNavigate } from "react-router-dom";


export const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
  });

  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
        address1: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipcode: user.address?.zipcode || "",
        country: user.address?.country || "India",
      }));
    }
  }, [user]);


  useEffect(() => {
    if (paymentMethod !== "UPI") {
      setTransactionId("");
    }
  }, [paymentMethod]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = items.reduce((acc, item) => {
    const price =
      typeof item.product.price === "number"
        ? item.product.price
        : item.product.price?.selling || 0;
    return acc + price * item.quantity;
  }, 0);

  const shipping = subtotal > 1000 ? 0 : 80;
  const totalAmount = subtotal + shipping;


  const isAddressValid =
    address.fullName &&
    address.phone &&
    address.address1 &&
    address.city &&
    address.state &&
    address.zipcode;

  const canPlaceOrder =
    isAddressValid &&
    paymentMethod &&
    (paymentMethod !== "UPI" || transactionId);


  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return;

    const orderData = {
      items: items.map((item) => ({
        productId: item.product._id,
        productName: item.product.productName,
        price:
          typeof item.product.price === "number"
            ? item.product.price
            : item.product.price?.selling,
        quantity: item.quantity,
        images: item.product.images,
      })),
      total: totalAmount,
      paymentMethod,
      paymentDetails:
        paymentMethod === "UPI"
          ? { transactionId, status: "pending" }
          : undefined,
      deliveryAddress: {
        ...address,
        email: user.email,
      },
    };

    const result = await dispatch(placeOrder({ orderData }));
    

    if (placeOrder.fulfilled.match(result)) {
      setShowSuccessModal(true);
    }
  };


  return (
    <div className="min-h-screen bg-[#faf7f3] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-8">

            <section>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Full Name" name="fullName" value={address.fullName} onChange={handleChange} />
                <Input label="Phone" name="phone" value={address.phone} onChange={handleChange} />
                <Input label="Address Line 1" name="address1" value={address.address1} onChange={handleChange} className="md:col-span-2" />
                <Input label="Address Line 2 (Optional)" name="address2" value={address.address2} onChange={handleChange} className="md:col-span-2" />
                <Input label="City" name="city" value={address.city} onChange={handleChange} />
                <Input label="State" name="state" value={address.state} onChange={handleChange} />
                <Input label="Zip Code" name="zipcode" value={address.zipcode} onChange={handleChange} />
                <Input label="Country" name="country" value={address.country} onChange={handleChange} />
              </div>
            </section>


            <section>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

              <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer mb-3">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <span className="font-medium">Cash on Delivery</span>
              </label>

              <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                />
                <span className="font-medium">UPI (Google Pay / PhonePe)</span>
              </label>

              {paymentMethod === "UPI" && (
                <div className="border rounded-lg p-4 bg-gray-50 mt-4 space-y-4">
                  <p className="text-sm text-gray-600 text-center">
                    Scan & Pay using any UPI app
                  </p>

                  <img
                    src="/scanner.jpeg"
                    alt="UPI QR"
                    className="mx-auto w-40 h-40 object-contain"
                  />

                  <Input
                    label="UPI Transaction ID"
                    placeholder="Enter UPI reference number"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />

                  <p className="text-xs text-orange-600 text-center">
                    Payment will be verified manually by admin
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-20">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-4">
                  <img
                    src={item.product.images?.[0]}
                    className="w-14 h-14 rounded object-contain"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.product.productName}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    ₹{((item.product.price?.selling || item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-6" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping ? `₹${shipping}` : "Free"}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">₹{totalAmount}</span>
              </div>
            </div>

            <button
              disabled={!canPlaceOrder}
              onClick={handlePlaceOrder}
              className={`w-full mt-6 py-3 rounded-xl font-semibold
                ${canPlaceOrder
                  ? "bg-sky-500 hover:bg-sky-600 text-white"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Place Order
            </button>

            {showSuccessModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md relative text-center">
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate("/");
                    }}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                  >
                    ✕
                  </button>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 text-3xl">✔</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-green-600">
                    Order Placed Successfully!
                  </h2>

                  <p className="text-sm text-gray-600 mt-2">
                    Thank you for your order. You can track it from your orders page.
                  </p>

                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate("/");
                    }}
                    className="mt-6 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, className = "", ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-sky-500"
    />
  </div>
);
