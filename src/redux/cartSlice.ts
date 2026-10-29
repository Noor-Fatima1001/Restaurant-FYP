import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, PaymentArgs, PlaceOrderArgs, Product, UpdateOrderFucnArgs } from '../types/interface';
import { CardElement } from "@stripe/react-stripe-js";
import Cookies from "js-cookie";
const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
  currencySymbol: localStorage.getItem('currencySymbol') ,
  currentActiveOrders: null,
  activeOrderId: "",
}

const baseUrl = import.meta.env.VITE_API_URL;



export const updateOrder=createAsyncThunk(
  "updateOrder",async ({orderId,products }:UpdateOrderFucnArgs,{rejectWithValue}) => {
     try{
      const body={
        products:products,
        orderId:orderId
      }
      const response=await fetch(`${baseUrl}/api/orders/${orderId}/update`,{
        method:"PUT",
        headers:{
          "Content-type":"application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body:JSON.stringify(body)
      })
      if(!response.ok){
         throw new Error("Update Failed"); 
      }
    } catch(err){
      console.error(err)
      return rejectWithValue(err);      
     }
  }
)


export const handlePayment = createAsyncThunk(
  "payments/handlePayment",
  async ({ id, stripe, elements, showPopup }: PaymentArgs, { rejectWithValue }) => {
    try {
      if (!stripe || !elements) {
        throw new Error("Stripe has not been initialized properly.");
      }

      const response = await fetch(`${baseUrl}/orders/${id}/payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get payment intent.");
      }

      const result = await response.json();
      const { clientSecret } = result;

      if (!clientSecret) {
        showPopup("Failed to get payment intent!");
        return rejectWithValue("Failed to get payment intent");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("CardElement not found.");
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        return rejectWithValue(error.message);
      }
      if (paymentIntent?.status === "succeeded") {
        const body={paymentIntentId:paymentIntent.id}
        const response=await fetch(`${import.meta.env.VITE_API_URL}/orders/update-payment-status`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`,
          },
          body:JSON.stringify(body),
        })
        if(!response.ok){
          showPopup(" Payment failed!");
          throw new Error("Failed to get payment intent.");
        }else{
          showPopup("Payment successful!");
        }
      } else {
        showPopup(" Payment failed!");
        return rejectWithValue("Payment failed");
      }
    } catch (error) {
      return rejectWithValue(error.message || "An error occurred during payment.");
    }
  }
);

export const placeOrder = createAsyncThunk(
  'placeorder',
  async ({products, showPopup }:PlaceOrderArgs, { rejectWithValue }) => {
    try{

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found.');
      const response = await fetch('https://restaurantbackend.dbitsdemo.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tableId: JSON.parse(Cookies.get("tableId")), products }),
      });
      
      const data = await response.json();
      if (response.ok) {
        showPopup('Order placed successfully!');
        
      } else {
        throw new Error(data.message || 'Failed to place the order.');
      }
    }catch(error){
      rejectWithValue(error);
    }
  }
)


export const getAllActiveOrders = createAsyncThunk('/cart/getAllActiveOrders', async (_, { rejectWithValue }) => {
  try {

    const response = await fetch(`${baseUrl}/api/orders?status=active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message || "Unknown error occurred");
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product[]>) => {
      action.payload.forEach((newItem) => {
        const existingItemIndex = state.items.findIndex((item) => item.id === newItem.id);

        if (existingItemIndex !== -1) {
          state.items[existingItemIndex] = {
            ...state.items[existingItemIndex],
            quantity: newItem.quantity
          };
        } else {
          state.items.push(newItem);
        }
      });

      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.currencySymbol = '';
      localStorage.removeItem('cartItems');
      localStorage.removeItem('currencySymbol');
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllActiveOrders.fulfilled, (state, action) => {
        if(!action.payload.order){
          state.currentActiveOrders=null;
          state.currencySymbol=action.payload.currencySymbol;
        }else{
          state.currentActiveOrders = action.payload.order;
          state.currencySymbol=action.payload.currencySymbol;
          state.activeOrderId = action.payload.order.id;
        }
      })
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;