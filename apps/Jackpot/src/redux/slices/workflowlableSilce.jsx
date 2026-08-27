import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';

export const fetchWorkflowLabels = createAsyncThunk(
  'workflowLabel/fetchWorkflowLabels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('dashboard/statements/6a572bbf4726df04b976e8d7/screens');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something went wrong'
      );
    }
  }
);



export const fetchWorkflowSettings = createAsyncThunk(
  'workflow/fetchWorkflow',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('dashboard/statements/6a572bbf4726df04b976e8d7/workflow');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something went wrong'
      );
    }
  }
);

export const fetchWorkflowInfoLabels = createAsyncThunk(
  'workflowInfoLabel/fetchWorkflowInfoLabels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('dashboard/statements/6a572bbf4726df04b976e8d7/info');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something went wrong'
      );
    }
  }
);



const initialState = {
  workflowInfoLable: [],
  workflowLabels: [],
  workflow: {},
  loading: false,
  error: null,
};

const workflowLabelSlice = createSlice({
  name: 'workflowLabel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkflowLabels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflowLabels.fulfilled, (state, action) => {
        state.loading = false;
        state.workflowLabels = action.payload?.records ?? [];
      })
      .addCase(fetchWorkflowLabels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchWorkflowSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflowSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.workflow = action.payload?.records?.workflow ?? {};
      })
      .addCase(fetchWorkflowSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // info lable

      .addCase(fetchWorkflowInfoLabels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflowInfoLabels.fulfilled, (state, action) => {
        state.loading = false;
        state.workflowInfoLable = action.payload?.records ?? [];
      })
      .addCase(fetchWorkflowInfoLabels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      ;
  },
});

export default workflowLabelSlice.reducer;