import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';


export const fetchInsights = createAsyncThunk('insights/fetchInsights', 
    async ({ code }, { rejectWithValue }) => {
  var info = await getLoginInfo()
  try {
    const response = await api.get(`dashboard/getinsightdata/${info.id}/${code}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
const initialState = {
  insightdata: '',
  insightloading: false,
  insighterror: null,
};

const insightSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    resetInsight: (state) => {
      return initialState; // Reset state when logout
    },
    updateInsights: (state, action) => {
      state.insightdata = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.insightloading = true
      })
  
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.insightloading = false;
        state.insightdata = action.payload;

      })
  
      .addCase(fetchInsights.rejected, (state, action) => {
        state.insightloading = false;
        state.insighterror = action.error.message;
      });
  }
});
export const { resetInsight, updateInsights } = insightSlice.actions;
export default insightSlice.reducer;
