import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToWishList, removeFromWishList } from "../Redux/wishListSlice";
import { useNavigate } from "react-router-dom";

export const WishListHeart = ({ productId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, wishListLoading } = useSelector(
    (state) => state.wishList
  );
 

  const isWished = items?.some(
  (item) => item?.product?._id?.toString() === productId?.toString()
)

  const handleClick = (e) => {
  e.stopPropagation();

     console.log("CLICKED HEART 👉", productId);

  if (wishListLoading) return;

  if (isWished) {
    dispatch(removeFromWishList({ productId }));
  } else {
    dispatch(addToWishList({ productId }));
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
