import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';


export const fetchHanpickoffers = createAsyncThunk('handpicks/fetchHanpickoffers', async () => {
  var loginfo = await getLoginInfo()
  try{
    const response = await api.get(`dashboard/statements/${loginfo.id}/handpicks`)
    return response.data;
  } catch(e) {
     return e.response.data
  }

});

const initialState = {
  handpickdata: '',
  handpickloading: false,
  handpickerror: null,
};


const offerHandSlice = createSlice({
  name: 'handpicks',
  initialState,
  reducers: {
    resetHandOffers: (state) => {
      return initialState; // Reset state when logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHanpickoffers.pending, (state) => {
        if(state.handpickdata) {
          state.handpickloading = false;
        } else {
          state.handpickloading = true;
        }

      })
      .addCase(fetchHanpickoffers.fulfilled, (state, action) => {
        state.handpickloading = false;
        state.handpickdata = action.payload;
      })
      .addCase(fetchHanpickoffers.rejected, (state, action) => {
        state.handpickloading = false;
        state.handpickerror = action.error.message;
      });
  },
});
export const { resetHandOffers } = offerHandSlice.actions;
export default offerHandSlice.reducer;
