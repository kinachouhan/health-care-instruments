import categories from "../Jsondata/category.json";
import { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { addProduct, updateProduct, getProductById } from "../Redux/product";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

export const AdminAddProduct = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]);

  const { loading, singleProduct } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [productDetails, setProductDetails] = useState({
    productName: "",
    description: "",
    originalPrice: "",
    sellingPrice: "",
    category: "",
    subCategory: "",
    stock: "",
    brand: "",
    productGroupId: "", // ✅ new field for multiple brands
  });

  useEffect(() => {
    if (isEditMode) {
      dispatch(getProductById(id));
    }
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (singleProduct && isEditMode) {
      setProductDetails({
        productName: singleProduct.productName || "",
        description: singleProduct.description || "",
        brand: singleProduct.brand || "",
        originalPrice: singleProduct.price?.original || "",
        sellingPrice: singleProduct.price?.selling || "",
        category: singleProduct.category || "",
        subCategory: singleProduct.subCategory || "",
        stock: "",
        productGroupId: singleProduct.productGroupId || "",
      });

      setPreviews(singleProduct.images || []);
      setImages([null, null, null, null]);
    }
  }, [singleProduct, isEditMode]);

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

  // Validate required fields only
  if (
    !productDetails.productName ||
    !productDetails.description ||
    !productDetails.category ||
    !productDetails.subCategory ||
    !productDetails.originalPrice ||
    !productDetails.sellingPrice
  ) {
    toast.error("Please fill all required fields");
    return;
  }

  if (
    Number(productDetails.sellingPrice) >
    Number(productDetails.originalPrice)
  ) {
    toast.error("Selling price cannot be greater than original price");
    return;
  }

  if (!isEditMode && images.every((img) => img === null)) {
    toast.error("Please upload at least one product image");
    return;
  }

  const formData = new FormData();
  formData.append("productName", productDetails.productName);
  formData.append("description", productDetails.description);

  
  if (productDetails.brand) formData.append("brand", productDetails.brand);
  if (productDetails.productGroupId)
    formData.append("productGroupId", productDetails.productGroupId);

  formData.append("originalPrice", Number(productDetails.originalPrice));
  formData.append("sellingPrice", Number(productDetails.sellingPrice));
  formData.append("category", productDetails.category);
  formData.append("subCategory", productDetails.subCategory);

  if (productDetails.stock) {
    formData.append("stock", Number(productDetails.stock));
  }

  images.forEach((img) => {
    if (img) formData.append("images", img);
  });

  try {
    if (isEditMode) {
      await dispatch(updateProduct({ id, formData })).unwrap();
      toast.success("Product updated successfully");
    } else {
      await dispatch(addProduct(formData)).unwrap();
      toast.success("Product added successfully");
    }

    // Reset form
    setProductDetails({
      productName: "",
      description: "",
      originalPrice: "",
      sellingPrice: "",
      category: "",
      subCategory: "",
      stock: "",
      brand: "",
      productGroupId: "",
    });
    setImages([null, null, null, null]);
    setPreviews([null, null, null, null]);
  } catch (error) {
    toast.error(error?.message || "Something went wrong");
  }
};


  return (
    <div className="mb-20">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white shadow-md rounded-lg px-6 py-4 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center py-5">
          {isEditMode ? "Update Product" : "Add New Product"}
        </h2>

        <div>
          <h3 className="font-semibold mb-2">Upload Images</h3>
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

        {/* Product Group ID */}
        <input
          type="text"
          name="productGroupId"
          placeholder="Product Group ID (optional)"
          value={productDetails.productGroupId}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded px-3 py-2"
        />
        <span className="text-gray-500 text-xs">
          Leave empty for new product. Use existing group ID to add a new brand variant.
        </span>

        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={productDetails.productName}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded px-3 py-2"
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand Name"
          value={productDetails.brand}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded px-3 py-2"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={productDetails.description}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded px-3 py-2 min-h-[120px]"
        />

        <div className="flex gap-5">
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

          {selectedCategory && (
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
          )}
        </div>

        <div className="flex gap-5">
          <input
            type="number"
            name="originalPrice"
            placeholder="Original Price (MRP)"
            value={productDetails.originalPrice}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2"
          />
          <input
            type="number"
            name="sellingPrice"
            placeholder="Selling Price"
            value={productDetails.sellingPrice}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2"
          />
        </div>

        <input
          type="number"
          name="stock"
          min="0"
          placeholder="Stock Quantity"
          value={productDetails.stock}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-sky-600 text-white p-2 px-6 rounded"
        >
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update Product"
            : "Add Product"}
        </button>
      </form>
    </div>
  );
};
