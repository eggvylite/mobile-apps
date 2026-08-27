import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';



export const fetchLabel = createAsyncThunk(
  'labels/fetchLabel',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('labels/getlabels');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  label: '',
  goalLabel: [],
  dashboardLabel: [],
  marketPlaceLabel: [],
  record: [],
  bankConnect_Component: [],
  labelloding: false,
  labelerror: null

};

const labelSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    resetlabel: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabel.pending, (state) => {
        state.labelloding = true;
        state.error = null;
      })
      .addCase(fetchLabel.fulfilled, (state, action) => {
        state.labelloding = false;
        state.label = action.payload
        state.record = action.payload?.records
        state.goalLabel = action.payload?.records.find((obj) => obj?.name === 'Goals')
        state.dashboardLabel = action.payload?.records.find((obj) => obj?.name === 'Dashboard')
        state.marketPlaceLabel = action.payload?.records.find((obj) => obj?.name === 'Dashboard_Marketplace')
        state.bankConnect_Component = action.payload?.records.find((obj) => obj?.name === 'BankConnect_Componenent')

      })
      .addCase(fetchLabel.rejected, (state, action) => {
        state.labelloding = false;
        state.labelerror = action.payload || action.error.message;
      });
  },
});

export const { resetlabel } = labelSlice.actions;

export default labelSlice.reducer;