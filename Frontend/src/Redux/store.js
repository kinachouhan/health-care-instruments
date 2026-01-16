
import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./auth.js"


const store = configureStore({
      reducer: {
          user: userReducer
      }
})

export default store