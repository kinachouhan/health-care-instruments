import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { placeOrder } from "../Redux/orderSlice";

export const Checkout = () => {
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
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


  const handlePlaceOrder = () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.address1 ||
      !address.city ||
      !address.state ||
      !address.zipcode
    ) {
      alert("Please fill all required delivery fields");
      return;
    }

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
      paymentMethod: "COD",

      userData: {
        ...address,
        email: user.email, 
      },
    };

    dispatch(placeOrder(orderData));
  };

  return (
    <div className="min-h-screen bg-[#faf7f3] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Full Name" name="fullName" value={address.fullName} onChange={handleChange} />
              <Input label="Phone Number" name="phone" value={address.phone} onChange={handleChange} />
              <Input label="Address Line 1" name="address1" value={address.address1} onChange={handleChange} className="md:col-span-2" />
              <Input label="Address Line 2 (Optional)" name="address2" value={address.address2} onChange={handleChange} className="md:col-span-2" />
              <Input label="City" name="city" value={address.city} onChange={handleChange} />
              <Input label="State" name="state" value={address.state} onChange={handleChange} />
              <Input label="Zip Code" name="zipcode" value={address.zipcode} onChange={handleChange} />
              <Input label="Country" name="country" value={address.country} onChange={handleChange} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-20">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-4 items-center">
                  <img
                    src={item.product.images?.[0]}
                    className="w-16 h-16 object-contain rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm line-clamp-1">
                      {item.product.productName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{((item.product.price?.selling || item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-6" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-semibold"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable Input */
const Input = ({ label, className = "", ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
    />
  </div>
);
