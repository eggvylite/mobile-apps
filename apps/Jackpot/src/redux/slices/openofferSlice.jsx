import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';


export const fetchOpenoffers = createAsyncThunk('openoffers/fetchOpenoffers', async () => {
  var loginfo = await getLoginInfo()
  try{
    const response = await api.get(`dashboard/statements/${loginfo.id}/open_offers`)
    return response.data;
  } catch(e) {
     return e.response.data
  }

});

const initialState = {
  openofferdata: '',
  openofferloading: false,
  openoffererror: null,
};


const openofferSlice = createSlice({
  name: 'openoffers',
  initialState,
  reducers: {
    resetOpenOffers: (state) => {
      return initialState; // Reset state when logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpenoffers.pending, (state) => {
        if(state.openofferdata) {
          state.openofferloading = false;
        } else {
          state.openofferloading = true;
        }

      })
      .addCase(fetchOpenoffers.fulfilled, (state, action) => {
        state.openofferloading = false;
        state.openofferdata = action.payload;
      })
      .addCase(fetchOpenoffers.rejected, (state, action) => {
        state.openofferloading = false;
        state.openoffererror = action.error.message;
      });
  },
});
export const { resetOpenOffers } = openofferSlice.actions;
export default openofferSlice.reducer;
