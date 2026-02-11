import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersAdmin,
  updateOrderStatus,
  verifyUpiPayment,
} from "../Redux/orderSlice";

const STATUS_OPTIONS = [
  "Order-Placed",
  "Pending",
  "Shipping",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export const AdminAllOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrdersAdmin());
  }, [dispatch]);

  const handleVerifyClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowVerifyModal(true);
  };

  const confirmVerifyPayment = () => {
    dispatch(verifyUpiPayment({ orderId: selectedOrderId }));
    setShowVerifyModal(false);
    setSelectedOrderId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#faf7f3]">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#faf7f3] min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8">
          Admin · All Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map((order) => {
            const isUpiPending =
              order.paymentMethod === "UPI" &&
              order.paymentStatus === "pending";

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-6 mb-6 border"
              >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500">
                      ORDER ID
                    </p>
                    <p className="font-semibold text-sm break-all">
                      {order._id}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.userId?.name} • {order.userId?.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      ₹{order.total}
                    </p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="mt-5 bg-gray-50 rounded-xl p-4 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-700">
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* PAYMENT */}
                <div className="mt-5 flex flex-wrap gap-4 items-center">
                  <div className="text-sm">
                    <span className="text-gray-500">Payment:</span>{" "}
                    <span className="font-semibold">
                      {order.paymentMethod}
                    </span>
                  </div>

                  {isUpiPending && (
                    <button
                      onClick={() => handleVerifyClick(order._id)}
                      className="ml-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Verify UPI Payment
                    </button>
                  )}
                </div>

                {/* STATUS */}
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    Order Status
                  </span>

                  <select
                    value={order.status}
                    disabled={isUpiPending}
                    onChange={(e) =>
                      dispatch(
                        updateOrderStatus({
                          orderId: order._id,
                          status: e.target.value,
                        })
                      )
                    }
                    className="border rounded-lg px-4 py-2 text-sm bg-white disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {order.status === "Delivered" && (
                  <p className="mt-3 text-sm text-green-600">
                    ✔ Stock updated & payment completed
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* VERIFY MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-xl">
            <h2 className="text-lg font-bold mb-2">
              Confirm UPI Payment
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Have you received the payment?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-6 py-2 rounded-lg border hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={confirmVerifyPayment}
                className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
              >
                Yes, Received
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
