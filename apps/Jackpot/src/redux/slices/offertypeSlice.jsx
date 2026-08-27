import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';



export const fetchOffertype = createAsyncThunk('offerstype/fetchOffertype', async () => {
  var loginfo = await getLoginInfo()
  try{
    const response = await api.get(`dashboard/statements/${loginfo.id}/offtypes`)
    return response.data;
  } catch(e) {
     return e.response.data
  }

});

const initialState = {
  offerstypedata: '',
  offerstypeloading: false,
  offerstypeerror: null,
};


const offertypeSlice = createSlice({
  name: 'offerstype',
  initialState,
  reducers: {
    resetOfferstype: (state) => {
      return initialState; // Reset state when logout
    },
    updateOfferstype: (state, action) => {
      state.offerstypedata = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffertype.pending, (state) => {
        if(state.offerstypedata) {
          state.offerstypeloading = false;
        } else {
          state.offerstypeloading = true;
        }

      })
      .addCase(fetchOffertype.fulfilled, (state, action) => {
        state.offerstypeloading = false;
        state.offerstypedata = action.payload;
      })
      .addCase(fetchOffertype.rejected, (state, action) => {
        state.offerstypeloading = false;
        state.offerstypeerror = action.error.message;
      });
  },
});
export const { resetOfferstype,updateOfferstype } = offertypeSlice.actions;
export default offertypeSlice.reducer;
