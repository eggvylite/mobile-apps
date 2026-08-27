import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';


export const fetchGoalhis = createAsyncThunk('goalhistrory/fetchGoalhis', async (res) => {
  var info = await getLoginInfo()
  const response = await api.get(`dashboard/statements/${info.id}/goalhistory`)
  return response.data;

});
const initialState = {
  goalhisdata: '',
  goalhisloading: false,
  goalhiserror: null,
};

const goalhisSlice = createSlice({
  name: 'goalhistrory',
  initialState,
  reducers: {
    resetGoalhis: (state) => {
      return initialState; // Reset state when logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoalhis.pending, (state) => {
        if(state.goalhisdata)  {
          state.goalhisloading = false;
        } else {
          state.goalhisloading = true;
        }

      })
      .addCase(fetchGoalhis.fulfilled, (state, action) => {
        state.goalhisloading = false;
        state.goalhisdata = action.payload;
      })
      .addCase(fetchGoalhis.rejected, (state, action) => {
        state.goalhisloading = false;
        state.goalhiserror = action.error.message;
      });
  },
});
export const { resetGoalhis } = goalhisSlice.actions;
export default goalhisSlice.reducer;
