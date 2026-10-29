// Updated subscriptionsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Subscription } from '../types/interface';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // Always 0 for free products
}

export interface AvailableProduct {
  product: {
    imageUrls: string[];
    id: number;
    productName: string;
    price: string;
  };
  maxQuantity: number;
  totalRemaining: number;
  dailyRemaining: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SubscriptionsState {
  subscriptions: Subscription[];
  selectedSubscription: Subscription | null;
  clientSecret: string | null;
  freeProducts: AvailableProduct[];
  cart: CartItem[];
  loading: boolean;
  currencySymbol: string;
  error: string | null;
}

const initialState: SubscriptionsState = {
  subscriptions: [],
  selectedSubscription: null,
  clientSecret: null,
  freeProducts: [],
  cart: [],
  loading: false,
  currencySymbol: '$',
  error: null,
};

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const authToken = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/subscriptions/packages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      const data = await response.json();
      return data?.subscriptions as Subscription[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const fetchSubscriptionById = createAsyncThunk(
  'subscriptions/fetchSubscriptionById',
  async (id: string, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const authToken = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/subscriptions/package/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }
      const data = await response.json();
      return data?.subscription as Subscription;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  'subscriptions/createPaymentIntent',
  async (subscriptionId: string, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const authToken = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/subscriptions/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ subscriptionId }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        throw new Error(errorData.error || 'Failed to create payment intent');
      }
      const data = await response.json();
      return data.clientSecret as string;
    } catch (error) {
      
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const completePurchase = createAsyncThunk(
  'subscriptions/completePurchase',
  async ({ subscriptionId, paymentIntentId }: { subscriptionId: string; paymentIntentId: string }, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const authToken = localStorage.getItem('token');
      console.log('Sending completePurchase request:', { subscriptionId, paymentIntentId });
      const response = await fetch(`${baseUrl}/api/subscriptions/complete-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ subscriptionId, paymentIntentId }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to complete purchase');
      }
      const data = await response.json();
      
      return data.userSubscription as Subscription;
    } catch (error) {
      console.error('Error in completePurchase:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const fetchFreeProducts = createAsyncThunk(
  'subscriptions/fetchFreeProducts',
  async (userSubscriptionId: string, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const authToken = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/subscriptions/free-products/${userSubscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch free products');
      }
      const data = await response.json();
      return data?.availableProducts as AvailableProduct[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const placeFreeOrder = createAsyncThunk(
  'subscriptions/placeFreeOrder',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { subscriptions: SubscriptionsState };
      const cart = state.subscriptions.cart;
      const selectedSubscription = state.subscriptions.selectedSubscription;
      if (!selectedSubscription) {
        throw new Error('No selected subscription found');
      }
      const products = cart.map((item: CartItem) => ({
        productId: item.product.id,
        quantity: item.quantity
      }));
      const payload = {
        subscriptionId: selectedSubscription.id,
        tableId: 5, // TODO: Make dynamic if needed
        products
      };
      const baseUrl = import.meta.env.VITE_API_URL;
      const authToken = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/subscriptions/place-free-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to place free order');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    toggleSubscriptionSelection: (state, action: PayloadAction<string>) => {
      const index = state.subscriptions.findIndex((sub) => sub.id === action.payload);
      if (index !== -1) {
        state.subscriptions[index].selected = !state.subscriptions[index].selected;
      }
    },
    clearClientSecret: (state) => {
      state.clientSecret = null;
    },
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const exists = state.cart.find((item) => item.product.id === product.id);
      if (exists) {
        exists.quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((item) => item.product.id !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setSelectedSubscription: (state, action: PayloadAction<Subscription>) => {
      state.selectedSubscription = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload?.map((sub) => ({
          ...sub,
          selected: sub.selected ?? false,
        })) ?? [];
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSubscriptionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubscription = action.payload;
      })
      .addCase(fetchSubscriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        
        state.clientSecret = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.clientSecret = null;
      })
      .addCase(completePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completePurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubscription = action.payload;
        // Update the subscription in the list
        const index = state.subscriptions.findIndex((sub) => sub.id === action.payload.id);
        
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
        state.clientSecret = null;
      })
      .addCase(completePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.clientSecret = null;
      })
      .addCase(fetchFreeProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFreeProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.freeProducts = action.payload ?? [];
      })
      .addCase(fetchFreeProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(placeFreeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeFreeOrder.fulfilled, (state) => {
        state.loading = false;
        state.cart = [];
      })
      .addCase(placeFreeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  toggleSubscriptionSelection, 
  clearClientSecret, 
  addToCart, 
  removeFromCart, 
  clearCart,
  setSelectedSubscription
} = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;