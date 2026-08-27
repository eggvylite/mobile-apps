import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';



export const fetchAccount = createAsyncThunk('account/fetchAccount', async (res) => {
  var info = await getLoginInfo()
  const response = await api.get(`dashboard/statements/${info.id}/accounts`)
  return response.data;

});
const initialState = {
  accountdata: '',
  defaccount: [],
  allacountlist: [],
  accountloading: false,
  accounterror: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    resetAccount: (state) => {
      return initialState; // Reset state when logout
    },
    updateAccount: (state, action) => {
      state.accountdata = action.payload;
      var defac = action.payload.records.find((obj) => obj.account_default === 'Yes')
      var account = action.payload.records.filter((obj) => obj.bank_id === defac.bank_id)
      state.defaccount = account
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccount.pending, (state) => {
        state.accountloading = !state.accountdata;
      })
  
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.accountloading = false;
        state.accountdata = action.payload;
  
        const records = action.payload?.records || [];
  
        const defac = records.find(obj => obj.account_default === 'Yes');
  
        const account = defac
          ? records.filter(obj => obj.bank_id === defac.bank_id)
          : [];
  
        state.defaccount = account;
        state.allacountlist = records;
  

      })
  
      .addCase(fetchAccount.rejected, (state, action) => {
        state.accountloading = false;
        state.accountdata = false;
        state.accounterror = action.error.message;
      });
  }
});
export const { resetAccount, updateAccount } = accountSlice.actions;
export default accountSlice.reducer;
