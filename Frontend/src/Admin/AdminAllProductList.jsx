import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct, deleteProduct } from "../Redux/product";
import toast from "react-hot-toast";

export const AdminAllProductList = () => {
  const dispatch = useDispatch();


  const [page, setPage] = useState(1);
  const limit = 10;


  const {
    products = [],
    loading,
    error,
    totalPages = 1,
    currentPage = 1,
  } = useSelector((state) => state.product);

  console.log("page:", page);
  console.log("totalPages:", totalPages);
  console.log("currentPage:", currentPage);


  useEffect(() => {
    dispatch(getAllProduct({ page, limit }));
  }, [dispatch, page]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted successfully!");

      dispatch(getAllProduct({ page, limit }));
    } catch (err) {
      toast.error(err?.message || "Failed to delete product");
    }
  };


  if (loading) {
    return (
      <p className="text-center py-10 text-lg font-medium">
        Loading products...
      </p>
    );
  }


  if (error) {
    return (
      <p className="text-center py-10 text-red-500">
        {typeof error === "string" ? error : "Something went wrong"}
      </p>
    );
  }


  if (products.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No products found.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">S.No.</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Subcategory</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="p-2 border">{product.productName}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border">{product.subCategory}</td>
                <td className="p-2 border">₹{product.price}</td>

                <td className="p-2 border text-center">
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.productName}
                      className="w-14 h-14 object-cover rounded mx-auto"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                  )}
                </td>

                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-6 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${page === i + 1
                ? "bg-sky-600 text-white"
                : "bg-white hover:bg-gray-100"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};
