import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';


export const fetchmanualAccount = createAsyncThunk('manualaccount/fetchmanualAccount', async (res) => {
  const response = await api.get('contents/manualaccounts')
  return response.data;

});
const initialState = {
  manualaccount: [],
  manualaccountloading: false,
  manualaccounterror: null,
};

const manualaccountSlice = createSlice({
  name: 'manualaccount',
  initialState,
  reducers: {
    resetManualaccount: (state) => {
      return initialState; // Reset state when logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchmanualAccount.pending, (state) => {
        state.manualaccountloading = true;
      })
      .addCase(fetchmanualAccount.fulfilled, (state, action) => {
        state.manualaccount = action.payload;
      })
      .addCase(fetchmanualAccount.rejected, (state, action) => {
        state.manualaccounterror = false;
        state.manualaccounterror = action.error.message;
      });
  },
});
export const { resetManualaccount } = manualaccountSlice.actions;
export default manualaccountSlice.reducer;
