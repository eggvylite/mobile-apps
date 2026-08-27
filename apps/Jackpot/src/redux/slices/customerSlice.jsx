import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';


export const fetchCustomer = createAsyncThunk('customer/fetchCustomer', async (_, { rejectWithValue }) => {
  var info = await getLoginInfo()
  try {
    const response = await api.get("customer/" + info.id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const initialState = {
  cusDetails: '',
  cusloading: false,
  cuserror: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetCustomer: (state) => {
      return initialState; // Reset state when logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomer.pending, (state) => {
        state.cuserror = null;
        if (state.cusDetails) {
          state.cusloading = false;
        } else {
          state.cusloading = true;
        }

      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.cusloading = false;
        state.cusDetails = action.payload;
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.cusloading = false;
        state.cuserror = action.error.message;
      });
  },
});
export const { resetCustomer } = customerSlice.actions;
export default customerSlice.reducer;
