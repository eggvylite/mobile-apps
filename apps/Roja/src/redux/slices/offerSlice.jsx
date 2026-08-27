import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';
import { getLoginInfo } from '../../service/storage';

export const fetchOffers = createAsyncThunk('offers/fetchOffers', async () => {
  var loginfo = await getLoginInfo()
  try{
    const response = await api.get(`dashboard/statements/${loginfo.id}/offers`)
    return response.data;
  } catch(e) {
     return e.response.data
  }

});

const initialState = {
  offersdata: '',
  offersloading: false,
  offersnerror: null,
};


const offerSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    resetOffers: (state) => {
      return initialState; // Reset state when logout
    },
    updateOffers: (state, action) => {
      state.offersdata = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        if(state.offersdata) {
          state.offersloading = false;
        } else {
          state.offersloading = true;
        }

      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offersloading = false;
        state.offersdata = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.offersloading = false;
        state.offersnerror = action.error.message;
      });
  },
});
export const { resetOffers,updateOffers } = offerSlice.actions;
export default offerSlice.reducer;
