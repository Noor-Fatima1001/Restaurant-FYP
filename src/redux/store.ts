import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice'; // We'll create this next
import profileReducer from './ProfileSlice';
import loaderReducer from "./loaderSlice"
import subscriptionsReducer from "./subscriptionsSlice"
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    profile:profileReducer,
    loader: loaderReducer,
    subscriptions: subscriptionsReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;