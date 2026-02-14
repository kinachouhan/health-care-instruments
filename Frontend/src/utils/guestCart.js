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

  const existingIndex = cart.findIndex(
    (item) => item?.product?._id === product?._id
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
    if (cart[existingIndex].quantity <= 0) {
      cart.splice(existingIndex, 1);
    }
  } else {
   
    if (quantity > 0) {
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
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  return cart; 
};

export const removeFromGuestCart = (productId) => {
  const cart = getGuestCart().filter(
    (item) => item?.product?._id !== productId
  );

  localStorage.setItem("cart", JSON.stringify(cart));

  return cart; 
};

export const clearGuestCart = () => {
  localStorage.removeItem("cart");
  return [];
};
