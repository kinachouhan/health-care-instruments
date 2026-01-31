import { Cart } from "../Models/cartModule.js";

export const getMyCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product")

        res.status(200).json({
            success: true,
            responseData: cart || { items: [] }
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const addToCart = async (req, res) => {
    try {

        const userId = req.user._id
        const { productId, quantity } = req.body

        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) =>
                    item.product.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;

                if (cart.items[itemIndex].quantity <= 0) {
                    cart.items.splice(itemIndex, 1);
                }
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save()

        const populatedCart = await cart.populate("items.product");

        res.status(200).json({
            success: true,
             responseData: populatedCart.items,
        });
    }
    catch (error) {
        console.error("ADD TO CART ERROR 👉", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Product is not in cart"
      });
    }

    cart.items = cart.items.filter(item => item.product._id.toString() !== productId);
    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      responseData: cart.items  
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    } else {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Cart has been cleared!",
      responseData: cart.items,
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

