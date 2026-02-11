import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToWishList, removeFromWishList } from "../Redux/wishListSlice";
import toast from "react-hot-toast";

export const WishListHeart = ({ product }) => {
  const dispatch = useDispatch();

  const { items, wishListLoading } = useSelector((state) => state.wishList);
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);

  const isWished = items.some(
    (item) => item.product?._id === product._id
  );

  const handleClick = (e) => {
    e.stopPropagation();
    if (wishListLoading) return;

    if (isWished) {
      dispatch(
        removeFromWishList({
          productId: product._id,
          isLoggedIn,
        })
      );
      toast.success("Removed from WishList")
    } else {
      dispatch(
        addToWishList({
          product,
          isLoggedIn,
        })
      );
       toast.success("Added to WishList")
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-red-500 text-2xl active:scale-90 transition"
    >
      {isWished ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};
