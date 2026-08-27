import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useContext } from 'react';
import api from '../../service/api';



export const fetchmenuSevice = createAsyncThunk(
  'menudata/fetchmenuSevice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('dashboard/menu');
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  menudata: [],
  reportmenu: [],
  spendingcategoryicons: [],
  buttomnavigationbar: [],
  handpickoffers: [],
  offers: [],
  settingmenu: [],
  sidehead: [],
  onbordcontent: [],
  budget: [],
  goaltragets: [],
  report: [],
  settingcms: null,
  loading: false,
  error: '',
  icons: [],
  dashboard: [],
  insights: [],

};

const menuiconSlice = createSlice({
  name: 'menuicons',
  initialState,
  reducers: {
    resetmenuicons: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchmenuSevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchmenuSevice.fulfilled, (state, action) => {
        state.loading = false;
        state.menudata = action.payload?.records || [];

        state.offers = action.payload?.offers || [];
        state.settingcms = action.payload.settings || null,
          state.handpickoffers = action.payload?.records.filter(item => item.type === 'handpick');
        state.reportmenu = action.payload?.records.filter(item => item.type === 'reports');
        state.spendingcategoryicons = action.payload?.records.filter(item => item.type === 'icons');
        state.onbordcontent = action?.payload?.records.filter((item) => item.type === 'splash')
        state.buttomnavigationbar = action?.payload?.records.filter((item) => item.type === 'menu');
        state.settingmenu = action?.payload?.records.filter((item) => item.type === 'settings');
        state.sidehead = action?.payload?.records.filter((item) => item.type === 'sethead');
        state.icons = action?.payload?.records.filter((obj) => obj.type === 'icons');
        state.goaltragets = action?.payload?.records.filter((obj) => obj.type === 'goals');
        state.dashboard = action?.payload?.records.filter((obj) => obj.type === 'dashboards');
        state.insights = action?.payload?.records.filter((obj) => obj.type === 'insightss');
        state.report = action?.payload?.records.filter((obj) => obj.type === 'reports');





      })
      .addCase(fetchmenuSevice.rejected, (state, action) => {
        state.loading = false;
        if (action.payload.error?.response < 500) {
          state.error = action.payload.error?.response?.data?.message || action.error.message;
        } else {
          state.error = 'error'
        }


      });
  },
});

export const { resetmenuicons } = menuiconSlice.actions;

export default menuiconSlice.reducer;