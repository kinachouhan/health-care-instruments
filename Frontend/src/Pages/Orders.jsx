import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../Redux/orderSlice";

export const Orders = () => {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-sky-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f3] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">
            You have not placed any orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow p-6 space-y-4"
              >
     
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-sm">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">
                      {order.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-4 items-center"
                    >
                      <img
                        src={item.images?.[0]}
                        alt={item.productName}
                        className="w-14 h-14 object-contain rounded"
                      />

                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-sm">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>


                <div className="border-t pt-4 flex flex-wrap justify-between items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Payment Method:{" "}
                    <span className="font-medium">
                      {order.paymentMethod}
                    </span>
                  </p>

                  <p className="text-lg font-bold text-green-600">
                    Total: ₹{order.total}
                  </p>
                </div>

                {order.paymentMethod === "UPI" &&
                  order.paymentDetails?.transactionId && (
                    <div className="text-xs text-gray-500">
                      UPI Transaction ID:{" "}
                      <span className="font-medium">
                        {order.paymentDetails.transactionId}
                      </span>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
