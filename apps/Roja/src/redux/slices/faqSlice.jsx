import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';
import { act } from 'react';


export const fetchFaq = createAsyncThunk('faq/fetchFaq', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('contents/list?type=faq&status=Active');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const initialState = {
  faqdata: '',
  faqloading: false,
  faqerror: null,
};

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaq.pending, (state) => {
        state.faqloading= true
      })
      .addCase(fetchFaq.fulfilled, (state, action) => {
        state.faqdata = action.payload;
      })
      .addCase(fetchFaq.rejected, (state, action) => {
        state.any = false;
        state.faqerror = action.error.message;
      });
  },
});
export default faqSlice.reducer;
