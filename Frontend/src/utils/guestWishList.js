export const getGuestWishList = () => {
  try {
    const wishList = localStorage.getItem("wishList");
    return wishList ? JSON.parse(wishList) : [];
  } catch {
    return [];
  }
};

export const addToGuestWishList = (product) => {
  const wishList = getGuestWishList();

  const exists = wishList.some(
    (item) => item.product._id === product._id
  );

  if (exists) return;

  wishList.push({
    product: {
      _id: product._id,
      productName: product.productName,
      price: product.price,
      images: product.images,
    },
  });

  localStorage.setItem("wishList", JSON.stringify(wishList));
};

export const removeFromGuestWishList = (productId) => {
  const wishList = getGuestWishList().filter(
    (item) => item.product._id !== productId
  );
  localStorage.setItem("wishList", JSON.stringify(wishList));
};

export const clearGuestWishList = () => {
  localStorage.removeItem("wishList");
};
