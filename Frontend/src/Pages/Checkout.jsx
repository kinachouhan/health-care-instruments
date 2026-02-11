import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { placeOrder, clearBuyNowItem } from "../Redux/orderSlice";
import { useNavigate } from "react-router-dom";

export const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { buyNowItem } = useSelector((state) => state.order);

  /* ================= SNAPSHOT FIX ================= */
  const [checkoutItems, setCheckoutItems] = useState([]);

  useEffect(() => {
    const sourceItems = buyNowItem
      ? [{ product: buyNowItem.product, quantity: buyNowItem.quantity }]
      : items;

    setCheckoutItems(
      sourceItems.map((item) => ({
        product: { ...item.product },
        quantity: item.quantity,
      }))
    );
  }, []);
  /* ================================================= */

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
    if (paymentMethod !== "UPI") setTransactionId("");
  }, [paymentMethod]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= PRICE ================= */
  const subtotal = checkoutItems.reduce((acc, item) => {
    const price =
      typeof item.product.price === "number"
        ? item.product.price
        : item.product.price?.selling || 0;
    return acc + price * item.quantity;
  }, 0);

  const shipping = subtotal > 1000 ? 0 : 80;
  const totalAmount = subtotal + shipping;

  /* ================= VALIDATION ================= */
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

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return;

    const orderData = {
      items: checkoutItems.map((item) => ({
        productId: item.product._id,
        productName: item.product.productName,
        price:
          typeof item.product.price === "number"
            ? item.product.price
            : item.product.price?.selling,
        quantity: item.quantity,
        images: Array.isArray(item.product.images)
          ? item.product.images
          : [],
      })),
      total: totalAmount,
      paymentMethod,
      paymentDetails:
        paymentMethod === "UPI"
          ? { transactionId, status: "pending" }
          : null,
      deliveryAddress: { ...address, email: user.email },
    };

    const result = await dispatch(placeOrder(orderData));
    if (placeOrder.fulfilled.match(result)) {
      setShowSuccessModal(true);
      dispatch(clearBuyNowItem());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf7f3] to-[#f1ece6] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* ADDRESS */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Full Name" name="fullName" value={address.fullName} onChange={handleChange} />
                <Input label="Phone" name="phone" value={address.phone} onChange={handleChange} />
                <Input label="Address Line 1" name="address1" value={address.address1} onChange={handleChange} className="md:col-span-2" />
                <Input label="Address Line 2" name="address2" value={address.address2} onChange={handleChange} className="md:col-span-2" />
                <Input label="City" name="city" value={address.city} onChange={handleChange} />
                <Input label="State" name="state" value={address.state} onChange={handleChange} />
                <Input label="Zip Code" name="zipcode" value={address.zipcode} onChange={handleChange} />
                <Input label="Country" name="country" value={address.country} onChange={handleChange} />
              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>

              <PaymentOption
                checked={paymentMethod === "COD"}
                onClick={() => setPaymentMethod("COD")}
                title="Cash on Delivery"
                desc="Pay when product arrives"
              />

              <PaymentOption
                checked={paymentMethod === "UPI"}
                onClick={() => setPaymentMethod("UPI")}
                title="UPI Payment"
                desc="Google Pay / PhonePe / Paytm"
              />

              {paymentMethod === "UPI" && (
                <div className="mt-4 border rounded-xl p-4 bg-gray-50">
                  <img src="/scanner.jpeg" className="mx-auto w-40 mb-4" />
                  <Input
                    label="UPI Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                  <p className="text-xs text-orange-600 mt-2 text-center">
                    Payment will be verified by admin
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-20 h-fit">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {checkoutItems.map((item) => (
                <div key={item.product._id} className="flex gap-4">
                  <img
                    src={item.product.images?.[0] || "/placeholder.png"}
                    className="w-16 h-16 object-contain rounded-lg border"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.product.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    ₹{(
                      (item.product.price?.selling || item.product.price) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-4 space-y-2 text-sm">
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
              className={`w-full mt-6 py-3 rounded-xl font-semibold transition
                ${
                  canPlaceOrder
                    ? "bg-sky-500 hover:bg-sky-600 text-white"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md text-center relative">
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/");
              }}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>

            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <span className="text-green-600 text-3xl">✔</span>
            </div>

            <h2 className="text-xl font-bold text-green-600">
              Order Placed Successfully!
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              You can track your order from My Orders.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



const Input = ({ label, className = "", ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium mb-1 text-gray-600">
      {label}
    </label>
    <input
      {...props}
      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500"
    />
  </div>
);

const PaymentOption = ({ checked, onClick, title, desc }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer mb-3 transition
      ${checked ? "border-sky-500 bg-sky-50" : "hover:border-gray-400"}`}
  >
    <input type="radio" checked={checked} readOnly />
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  </div>
);
