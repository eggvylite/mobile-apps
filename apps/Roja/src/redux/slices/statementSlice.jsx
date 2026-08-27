import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLoginInfo } from "../../service/storage";
import api from "../../service/api";


export const fetchStatement = createAsyncThunk(
  "statement/fetchTransactions",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const info = await getLoginInfo()
      const response = await api.get(`dashboard/statements/${info?.id}/statements?page=${page}&size=${size}`);
      var resdata = response?.data?.records;
      return { records: resdata, page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
const initialState = {
  records: [],
  statementrecords:[],
  page: -1,
  size: 1000,
  firstTransDate:'',
  stloading: false,
  ststatus:'',
  stateMentError: null,
};
const statementSlice = createSlice({
  name: "statement",
  initialState,
  reducers: {
    resetStatement: (state) => {
      return initialState;
    },
    updateStatement: (state, action) => {
      state.records = action.payload;
    },
    updateFirstTransDate: (state, action) => {
      state.firstTransDate = action.payload;
      state.ststatus = 'completed'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatement.pending, (state) => {
        state.stateMentError = null;
        if (0 < state.records.length) {
          state.stloading = false;
        } else {
          state.stloading = true;
        }

      })
      .addCase(fetchStatement.fulfilled, (state, action) => {
        state.stloading = false;


        if(0 < state.records.length) {
          state.records.push(...action.payload.records)
        } else {
          state.records = action.payload.records
        }
        state.statementrecords = action.payload.records

        state.page = action.payload.page;

      })
      .addCase(fetchStatement.rejected, (state,action) => {
       state.stloading = false;
          state.stateMentError = action.payload || action.error.message || 'Something went wrong';
      });
  },
});
export const { resetStatement, updateStatement,updateFirstTransDate } = statementSlice.actions;
export default statementSlice.reducer;


