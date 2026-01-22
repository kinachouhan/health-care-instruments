
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./auth.js"
import productReducer from "./product.js"
import cartReducer from "./cartSlice.js"
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

const cartPersistConfig = {
    key: "cart",
    storage,
};

const persistedCartReducer = persistReducer(
    cartPersistConfig,
    cartReducer
);

/* ORDER PERSIST */
// const orderPersistConfig = {
//   key: "order",
//   storage,
// };

// const persistedOrderReducer = persistReducer(
//   orderPersistConfig,
//   orderReducer
// );

export const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer,
        cart: persistedCartReducer   // ✅ persisted reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});


export const persistor = persistStore(store);