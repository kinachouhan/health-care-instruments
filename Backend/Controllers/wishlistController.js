import { WishList } from "../Models/wishlistModel.js";

/* =========================
   GET MY WISHLIST
========================= */
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

/* =========================
   ADD TO WISHLIST
========================= */
export const addtoWishList = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    let wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      wishList = await WishList.create({
        user: userId,
        items: [{ product: productId }]
      });
    } else {
      const alreadyExists = wishList.items.some(
        item => item.product.toString() === productId
      );

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "Product already in wishlist"
        });
      }

      wishList.items.push({ product: productId });
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

/* =========================
   REMOVE FROM WISHLIST
========================= */
export const removeFromWishList = async (req, res) => {
  try {
    const { productId } = req.body;

    const wishList = await WishList
      .findOne({ user: req.user._id })
      .populate("items.product");

    if (!wishList) {
      return res.status(400).json({
        success: false,
        message: "Wishlist not found"
      });
    }

    wishList.items = wishList.items.filter(
      item => item.product._id.toString() !== productId
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

/* =========================
   CLEAR WISHLIST
========================= */
export const clearWishList = async (req, res) => {
  try {
    await WishList.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.status(200).json({
      success: true,
      message: "Wishlist has been cleared"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
