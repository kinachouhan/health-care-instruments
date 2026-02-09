import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./auth.js"
import productReducer from "./product.js"
import cartReducer from "./cartSlice.js"
import wishListReducer from "./wishListSlice.js"
import orderReducer from "./orderSlice.js"
import reviewReducer from "./reviewSlice.js"

export const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer,
        cart: cartReducer ,
        wishList : wishListReducer,
        order : orderReducer,
        review : reviewReducer
    }
});

export default store;