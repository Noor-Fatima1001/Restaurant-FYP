// import { Profile } from './../types/interface';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateProfileForm } from "../types/interface";
export const initialState = {
  profileData: {
    username:'',
    email:'',
    userType:''
  },
  loading: false,
  error: null
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const authToken = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/get-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      return data.profile || {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const UpdateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (formData: updateProfileForm, { rejectWithValue }) => {
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data=await response.json();
        throw new Error(data.error);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profileData = action.payload;
    })
    .addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(UpdateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profileData = action.payload.profile; // Updating with returned profile data
    })
  }
});

const profileReducer = profileSlice.reducer;
export default profileReducer;
