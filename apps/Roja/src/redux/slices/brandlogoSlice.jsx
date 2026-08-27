import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';

export const fetchBrandlogo = createAsyncThunk('brandlogo/fetchBrandlogo', async (res) => {
  const response =  await api.get('settings/systembrands')
  return response.data;

});
const initialState = {
  brandata: '',
  brandloading: false,
  branderror: null,
};

const brandlogoSlice = createSlice({
  name: 'brandlogo',
  initialState,
  reducers: {
    resetBrandlogo: (state) => {
      return initialState; // Reset state when logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrandlogo.pending, (state) => {
        state.brandloading = true;
      })
      .addCase(fetchBrandlogo.fulfilled, (state, action) => {
        state.branderror = false;
        state.brandata = action.payload;
      })
      .addCase(fetchBrandlogo.rejected, (state, action) => {
        state.branderror = false;
        state.branderror = action.error.message;
      });
  },
});

export const { resetBrandlogo } = brandlogoSlice.actions;
export default brandlogoSlice.reducer;
