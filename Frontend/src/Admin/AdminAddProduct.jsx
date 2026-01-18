import categories from "../Jsondata/category.json";
import { useState } from "react";

export const AdminAddProduct = () => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.slice(0, 3)); // only allow max 3 images
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    images.forEach((img, i) => formData.append(`image${i + 1}`, img));
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("price", price);

    // send to backend
    fetch("/api/products", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Product added successfully!");
        console.log(data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

      {/* Upload Images */}
      <div>
        <label className="block text-sm font-medium mb-1">Upload Images (max 3)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows="3"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      <div>
        <label className="block text-sm font-medium mb-1">Subcategory</label>
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select Subcategory</option>
          {categories.find((c) => c.name === category)?.sub.map((sub) => (
            <option key={sub.name} value={sub.name}>
              {sub.name}
            </option>))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-1">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 transition"
      >
        Add Product
      </button>
    </form>
  );
};
