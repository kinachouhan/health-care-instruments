import { WishList } from "../Models/wishlistModel.js";

export const getMyWishList = async (req, res) => {
  try {
    const wishList = await WishList
      .findOne({ user: req.user._id })
      .populate("items.product");

    res.status(200).json({
      success: true,
      responseData: wishList ? wishList.items : []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const addtoWishList = async (req, res) => {
  try {
    const { product } = req.body; // ✅ FIX
    const userId = req.user._id;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    let wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      wishList = await WishList.create({
        user: userId,
        items: [{ product }]
      });
    } else {
      const alreadyExists = wishList.items.some(
        item => item.product.toString() === product
      );

      if (alreadyExists) {
        return res.status(200).json({
          success: true,
          responseData: wishList.items
        });
      }

      wishList.items.push({ product });
    }

    await wishList.save();
    await wishList.populate("items.product");

    res.status(200).json({
      success: true,
      responseData: wishList.items
    });
  } catch (error) {
    console.error("ADD TO WISHLIST ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const removeFromWishList = async (req, res) => {
  try {
    const { productId } = req.body;

    const wishList = await WishList.findOne({ user: req.user._id });

    if (!wishList) {
      return res.status(400).json({
        success: false,
        message: "Wishlist not found"
      });
    }

    wishList.items = wishList.items.filter(
      item => item.product.toString() !== productId
    );

    await wishList.save();
    await wishList.populate("items.product");

    res.status(200).json({
      success: true,
      responseData: wishList.items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const clearWishList = async (req, res) => {
  try {
    const wishList = await WishList.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );

    res.status(200).json({
      success: true,
      responseData: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const mergeGuestWishList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Invalid wishlist items"
      });
    }

    let wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      wishList = await WishList.create({
        user: userId,
        items
      });
    } else {
      items.forEach((guestItem) => {
        const exists = wishList.items.some(
          item => item.product.toString() === guestItem.product.toString()
        );

        if (!exists) {
          wishList.items.push({ product: guestItem.product });
        }
      });

      await wishList.save();
    }

    await wishList.populate("items.product");

    res.status(200).json({
      success: true,
      responseData: wishList.items
    });
  } catch (error) {
    console.error("MERGE WISHLIST ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

