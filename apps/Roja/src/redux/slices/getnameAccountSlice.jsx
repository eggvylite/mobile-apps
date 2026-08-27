import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';


export const fetchnamegetAccount = createAsyncThunk('getaccountname/fetchgetAccount', async () => {
    var info = await getLoginInfo()
    const response = await api.get(`customer/getAccountslist/${info.id}`)
    return response.data;

});
const initialState = {
    getnameaccountdata: [],
    getnameaccountloading: false,
    getnameaccounterror: null,
};

const getnameAccountSlice = createSlice({
    name: 'getaccountname',
    initialState,
    reducers: {
        resetgetaccount: (state) => {
            return initialState; // Reset state when logout
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchnamegetAccount.pending, (state) => {
                state.getnameaccountloading = true;
            })
            .addCase(fetchnamegetAccount.fulfilled, (state, action) => {
                state.getnameaccountdata = action.payload;
            })
            .addCase(fetchnamegetAccount.rejected, (state, action) => {
                state.getnameaccountloading = false;
                state.getnameaccounterror = action.error.message;
            });
    },
});
export const { resetgetaccount } = getnameAccountSlice.actions;
export default getnameAccountSlice.reducer;
