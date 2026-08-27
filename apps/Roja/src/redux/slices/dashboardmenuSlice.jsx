import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';



export const fetchDashboardmenu = createAsyncThunk(
  'dashboardmenu/fetchDashboardmenu',
  async (_, { rejectWithValue }) => {
    try {
      const info = await getLoginInfo()
      const response = await api.get(
        `dashboard/statements/${info.id}/dashsection`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  dashboardmenudata: [],
  dashboardmenuloading:false,
  dashboardmenuerror:null
};

const dashboardmenuSlice = createSlice({
  name: 'dashboardmenu',
  initialState,
  reducers: {
    resetmenuicons: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardmenu.pending, (state) => {
        state.dashboardmenuerror = null;
        if (state.dashboardmenudata && state.dashboardmenudata.length > 0) {
          state.dashboardmenuloading = false;
        } else {
          state.dashboardmenuloading = true;
        }
      })
      .addCase(fetchDashboardmenu.fulfilled, (state, action) => {
        state.dashboardmenuloading = false;
        state.dashboardmenudata = action.payload?.records || [];
       
      })
      .addCase(fetchDashboardmenu.rejected, (state, action) => {
        state.dashboardmenuloading = false;
        state.dashboardmenuerror = action.payload || action.error.message;
      });
  },
});

export const { resetmenuicons } = dashboardmenuSlice.actions;

export default dashboardmenuSlice.reducer;