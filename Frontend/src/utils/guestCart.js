
export const getGuestCart = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (err) {
    return [];
  }
};

export const addToGuestCart = ({ product, quantity = 1 }) => {
  const cart = getGuestCart();

  const existing = cart.find(
    (item) => item.product._id === product._id
  );

  if (existing) {
    existing.quantity += quantity;

    if (existing.quantity <= 0) {
      const filtered = cart.filter(
        (item) => item.product._id !== product._id
      );
      localStorage.setItem("cart", JSON.stringify(filtered));
      return;
    }
  } else {
    cart.push({
      product: {
        _id: product._id,
        productName: product.productName,
        price: product.price,
        images: product.images,
      },
      quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};


export const removeFromGuestCart = (productId) => {
  const cart = getGuestCart().filter(
    (item) => item.product._id !== productId
  );

  localStorage.setItem("cart", JSON.stringify(cart));
};


export const clearGuestCart = () => {
  localStorage.removeItem("cart");
};
