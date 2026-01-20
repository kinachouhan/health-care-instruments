
import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./auth.js"
import productReducer from "./product.js"

const store = configureStore({
      reducer: {
          user: userReducer,
          product: productReducer
      }
})

export default store