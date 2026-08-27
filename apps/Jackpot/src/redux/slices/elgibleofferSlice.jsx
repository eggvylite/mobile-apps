import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';


export const fetchElgibleoffers = createAsyncThunk('elgible/fetchElgibleoffers', async (res) => {
  var info = await getLoginInfo()
  const response = await api.get(`offer_eligibility/geteligibleOffers?customerId=${info.id}`)
  return response.data;

});
const initialState = {
  eligibleData: '',
  elgibleLoading: false,
  elgibleError: null
};

const elgibleofferSlice = createSlice({
  name: 'elgible',
  initialState,
  reducers: {
    resetAccount: (state) => {
      return initialState; // Reset state when logout
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchElgibleoffers.pending, (state) => {
        state.elgibleLoading = !state.accountdata;
      })

      .addCase(fetchElgibleoffers.fulfilled, (state, action) => {
        state.elgibleLoading = false;
        state.eligibleData = action.payload

      })

      .addCase(fetchElgibleoffers.rejected, (state, action) => {
        state.elgibleLoading = false;
        state.elgibleError = action.error.message;
      });
  }
});

export default elgibleofferSlice.reducer;
