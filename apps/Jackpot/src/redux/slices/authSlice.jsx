import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';




export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (res) => {
  const response = await getLoginInfo()
  return response;

});
const initialState = {
  storedata: '',
  storeloading: false,
  storeerror: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => {
      return initialState; // Reset state when logout
    },
    updateAuthdata: (state, action) => {
      state.storedata = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuth.pending, (state) => {
        state.storeloading = false
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.storeloading = false;
        state.storedata = action.payload;
      })
      .addCase(fetchAuth.rejected, (state, action) => {
        state.storeloading = false;
        state.storeerror = action.error.message;
      });
  },
});
export const { resetAuth,updateAuthdata } = authSlice.actions;
export default authSlice.reducer;
