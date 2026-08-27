import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';

export const fetchTransaction = createAsyncThunk(
  'transaction/fetchTransaction',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const info = await getLoginInfo()

      const url = `subscribed_customers/transactions/${info.id}?page=${page}&size=${size}`
      
      const response = await api.get(url);



      return {
        data: response.data?.records,
        page: page,
        size:size,
        totelitem: response?.data?.totalItems,
        totelpagesize: response?.data?.totalPages
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  transdata: [],
  transpage:-1,
  transSize:50,
  transtotalpage:'',
  transtotalitem:'',
  transloading:false,
  transerror:null
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    resetTransaction: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransaction.pending, (state) => {
        if (state.transdata.length > 0) {
          state.transloading = false
        } else {
          state.transloading = true;
        }


      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.transloading = false;
        const newRecords = action.payload.data;

        if (state.transdata.length > 0) {
          state.transdata = [...state.transdata, ...newRecords];
        } else {
          state.transdata = newRecords;
        }

        state.transloading = false
        state.transpage = action.payload.page
        state.transtotalpage = action.payload.totelpagesize;
        state.transtotalitem= action.payload.totelitem
        state.transSize =action.payload.size

      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.transloading = false;
        state.transerror = action.payload;
      });
  },
});

export const { resetTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
