import categories from "../Jsondata/category.json";
import { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { addProduct } from "../Redux/product";
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../Redux/product";

export const AdminAddProduct = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]);

  const { loading } = useSelector(state => state.product)

  const dispatch = useDispatch()

  const navigate= useNavigate()

  const { id } = useParams(); // 🔥 if id exists → edit mode
  const isEditMode = Boolean(id);

  const { singleProduct } = useSelector(state => state.product);

  useEffect(() => {
    if (isEditMode) {
      dispatch(getProductById(id));
    }
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (singleProduct && isEditMode) {
      setProductDetails({
        productName: singleProduct.productName,
        description: singleProduct.description,
        price: singleProduct.price,
        category: singleProduct.category,
        subCategory: singleProduct.subCategory,
        stock: "", // 🔥 empty (admin adds extra stock)
      });

      setPreviews(singleProduct.images || []);
      setImages([null, null, null, null]); // images optional on edit
    }
  }, [singleProduct, isEditMode]);


  const [productDetails, setProductDetails] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    stock: ""
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" && { subCategory: "" }),
    }));
  };


  const handleImages = (index, file) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages[index] = file;
    newPreviews[index] = file ? URL.createObjectURL(file) : null;
    setImages(newImages);
    setPreviews(newPreviews);
  };


  useEffect(() => {
    return () => {
      previews.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previews]);


  const selectedCategory = categories.find(
    (cat) => cat.name === productDetails.category
  );


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!productDetails.productName || !productDetails.description ||
      !productDetails.category || !productDetails.subCategory || !productDetails.price) {
      toast.error("All fields are required.");
      return;
    }

    // For new product, at least one image is required
    if (!isEditMode && images.every((img) => img === null)) {
      toast.error("Please upload at least one product image.");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productDetails.productName);
    formData.append("description", productDetails.description);
    formData.append("price", Number(productDetails.price)); // ✅ convert to number
    formData.append("category", productDetails.category);
    formData.append("subCategory", productDetails.subCategory);

    // Stock only if filled
    if (productDetails.stock) {
      formData.append("stock", Number(productDetails.stock)); // ✅ convert to number
    }

    images.forEach((img) => {
      if (img) formData.append("images", img);
    });

    try {
      if (isEditMode) {
        await dispatch(updateProduct({ id, formData })).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await dispatch(addProduct(formData)).unwrap();
        toast.success("Product added successfully!");
      }

       setProductDetails({
        productName: "",
        description: "",
        price: "",
        category: "",
        subCategory: "",
        stock: ""
      });
      setImages([null, null, null, null]);
      setPreviews([null, null, null, null]);
  
     
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };


  return (
    <div className="mb-20">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white shadow-md rounded-lg px-6 py-4 space-y-4">
        <h2 className="text-2xl font-semibold text-center py-5">Add New Product</h2>

        <div className="flex flex-col gap-10">
          <div>
            <h3 className=" font-semibold mb-2">Upload Images</h3>

            <div className="flex gap-4 flex-wrap">
              {images.map((_, index) => (
                <div
                  key={index}
                  className="w-28 h-28 border border-gray-200 rounded-lg overflow-hidden"
                >
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleImages(index, e.target.files[0])}
                    />

                    {previews[index] ? (
                      <img
                        src={previews[index]}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-3xl text-gray-400" />
                        <span className="text-xs text-gray-400">Upload</span>
                      </>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>


          <div>
            <label className="block font-medium mb-1">
              Product Name:
              <input
                type="text"
                name="productName"
                value={productDetails.productName}
                onChange={handleChange}
                placeholder="Enter Product Name"
                className="w-full border border-gray-200 rounded px-3 py-2"
              />
            </label>

          </div>

          <div>
            <label className="block font-medium mb-1">
              Description:
              <textarea
                name="description"
                value={productDetails.description}
                onChange={handleChange}
                placeholder="Enter Product Description"
                className="w-full border border-gray-200 rounded px-3 py-2 min-h-[120px]"
              />
            </label>
          </div>

          <div className="flex gap-5 w-full justify-between">

            <div className="w-full">
              <label className="block font-medium mb-1">Category</label>
              <select
                name="category"
                value={productDetails.category}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded px-3 py-2"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>


            {selectedCategory && (
              <div className="w-full">
                <label className="block font-medium mb-1">Sub Category</label>
                <select
                  name="subCategory"
                  value={productDetails.subCategory}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                >
                  <option value="">Select Subcategory</option>
                  {selectedCategory.sub.map((sub) => (
                    <option key={sub.name} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}


            <div className="w-full">
              <label className="block font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={productDetails.price}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              min="0"
              value={productDetails.stock}
              onChange={handleChange}
              placeholder="Enter available stock"
              className="w-full border border-gray-200 rounded px-3 py-2"
            />
          </div>


          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-600 text-white p-2 px-4 rounded"
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
