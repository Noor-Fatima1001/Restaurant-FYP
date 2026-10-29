import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product, ProductsState } from '../types/interface';

const initialState: ProductsState = {
  products: [],
  loading: false,
  currencySymbol: '$',
  error: null
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (category: string | null, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const authToken = localStorage.getItem('token');
      let region='';
      await fetch("http://ip-api.com/json")
      .then((res) => res.json())
      .then((data) => region =data.countryCode)
      .catch((err) => console.error(err.message))
      const response = await fetch(`${baseUrl}/get-products?category=${category}&region=${region}R`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductsByEvent = createAsyncThunk(
  'products/fetchProducts',
  async (eventId: string | null, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const authToken = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/get-products?eventId=${eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    syncProductsWithCart: (state, action: PayloadAction<Product[]>) => {
      state.products = state.products.map(product => {
        const cartItem = action.payload.find(item => item.id === product.id);
        if (cartItem) {
          return {
            ...product,
            active: true,
            quantity: cartItem.quantity
          };
        }
        return {
          ...product,
          active: false,
          quantity: 0
        };
      });
    },

    
    toggleProductActive: (state, action: PayloadAction<number>) => {
      const product = state.products.find(p => p.id === action.payload);
      if (product) {
        product.active = !product.active;
        product.quantity = 0;
      }
    },

    removeProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter(product => product.id !== action.payload);
    },
    
    updateProductQuantityByAmount: (state, action: PayloadAction<{
      productId: number,
      amount:number
    }>) => {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (product) {
        product.quantity=action.payload.amount;
      }
    },
    updateProductQuantity: (state, action: PayloadAction<{
      productId: number,
      action: 'increment' | 'decrement'
    }>) => {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (product) {
        if (action.payload.action === 'increment') {
          product.quantity += 1;
          product.active = true;
        } else {
          product.quantity = Math.max(0, product.quantity - 1);
          if (product.quantity === 0) {
            product.active = false;
          }
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.currencySymbol=action.payload.currencySymbol;
        localStorage.setItem('currencySymbol',state.currencySymbol);
        state.products = action.payload.products.map(product => ({
          ...product,
          active: false,
          quantity: 0
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
         action.payload as string;
      });
  }
});

export const { 
  syncProductsWithCart, 
  toggleProductActive, 
  updateProductQuantity,
  updateProductQuantityByAmount ,
  removeProduct
} = productsSlice.actions;
export default productsSlice.reducer;