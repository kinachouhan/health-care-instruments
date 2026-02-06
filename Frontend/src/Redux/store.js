
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./auth.js"
import productReducer from "./product.js"
import cartReducer from "./cartSlice.js"
import wishListReducer from "./wishListSlice.js"


export const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer,
        cart: cartReducer ,
        wishList : wishListReducer   
    },
});


export default store;