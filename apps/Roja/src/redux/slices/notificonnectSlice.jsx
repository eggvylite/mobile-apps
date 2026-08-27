import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';



export const fetchnotiConnect = createAsyncThunk('notificonect/fetchnotiConnect', async () => {
  const response = 'check notifi'
  return response;

});
const initialState = {
  notifidata: '',
  notifiloading: false,
  notifierror: null,
};

const notificonnectSlice = createSlice({
  name: 'notificonect',
  initialState,
  reducers: {
    resetnotifiConnect: (state) => {
      return initialState; // Reset state when logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchnotiConnect.pending, (state) => {
        state.notifiloading = false
      })
      .addCase(fetchnotiConnect.fulfilled, (state, action) => {
        state.notifiloading = false;
        state.notifidata = action.payload;
      })
      .addCase(fetchnotiConnect.rejected, (state, action) => {
        state.notifiloading = false;
        state.notifierror = action.error.message;
      });
  },
});
export const { resetnotifiConnect } = notificonnectSlice.actions;
export default notificonnectSlice.reducer;
