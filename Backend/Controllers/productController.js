import { Product } from "../Models/productModel.js"
import cloudinary from "../cloudinary/cloudinary.js"


export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      originalPrice,
      sellingPrice,
      category,
      subCategory,
      stock,
    } = req.body;

    const stockNum = Number(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({ success: false, message: "Invalid stock value" });
    }

    if (!originalPrice || !sellingPrice) {
      return res.status(400).json({
        success: false,
        message: "Original price and selling price are required",
      });
    }

    if (Number(sellingPrice) > Number(originalPrice)) {
      return res.status(400).json({
        success: false,
        message: "Selling price cannot be greater than original price",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const imageUrls = [];
    for (const file of req.files) {
      if (!file?.buffer) continue;

      const secureUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });

      imageUrls.push(secureUrl);
    }

    const product = await Product.create({
      productName,
      description,
      price: {
        original: Number(originalPrice),
        selling: Number(sellingPrice),
      },
      category,
      subCategory,
      totalStock: stockNum,
      availableStock: stockNum,
      images: imageUrls,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Fetch only limited products for this page
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Count total documents for pagination
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      responseData: products,                 // products for current page
      totalPages: Math.ceil(totalProducts / limit), // total pages
      currentPage: page,        // current page number
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    })
  }
  catch (error) {

    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
}

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(id)

    return res.status(200).json({
      success: true,
      responseData: product
    })


  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
}


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      productName,
      description,
      category,
      subCategory,
      stock,
      addStock,
      originalPrice,
      sellingPrice,
    } = req.body;

    if (!productName || !description || !category || !subCategory) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    product.productName = productName;
    product.description = description;
    product.category = category;
    product.subCategory = subCategory;

    if (originalPrice !== undefined && sellingPrice !== undefined) {
      if (Number(sellingPrice) > Number(originalPrice)) {
        return res.status(400).json({
          message: "Selling price cannot be greater than original price",
        });
      }
      product.price = {
        original: Number(originalPrice),
        selling: Number(sellingPrice),
      };
    }

    if (stock !== undefined) {
      product.totalStock = Number(stock);
      product.availableStock = Number(stock);
    } else if (addStock) {
      product.totalStock += Number(addStock);
      product.availableStock += Number(addStock);
    }

    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        imageUrls.push(result.secure_url);
      }
      product.images = imageUrls;
    }

    await product.save();

    res
      .status(200)
      .json({ message: "Product updated successfully", responseData: product });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};




