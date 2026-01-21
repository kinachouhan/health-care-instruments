import { Product } from "../Models/productModel.js"
import cloudinary from "../cloudinary/cloudinary.js"


export const addProduct = async (req, res) => {
  try {
    
    const { productName, price, description, category, subCategory } = req.body;

    // Validation
    if (!productName || !price || !description || !category || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
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

    // Save product
    const product = await Product.create({
      productName,
      description,
      price,
      category,
      subCategory,
      images: imageUrls, // ✅ use imageUrls
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      responseData: product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



// backend controller
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
        const {id} = req.params

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