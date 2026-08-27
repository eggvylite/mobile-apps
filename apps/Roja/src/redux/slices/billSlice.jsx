import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';

export const fetchBills = createAsyncThunk('bank/fetchBills', async (res) => {
    const info = await getLoginInfo()
    const response = await api.get(`dashboard/statements/${info?.id}/bills`);
    return response.data;

});
const initialState = {
    billdata: [],
    billloading: false,
    billerror: null,
};

const billSlice = createSlice({
    name: 'bill',
    initialState,
    reducers: {
        resetBill: (state) => {
            return initialState;
        },
        deleteBillItem(state, action) {
            state.billdata = state.billdata.filter(
                item => item._id !== action.payload
            );
        },
        addBillItem(state, action) {
            state.billdata.push(action.payload);
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBills.pending, (state) => {
                state.billloading = true;
                // if (state.billdata) {
                //     state.billloading = false;
                // } else {
                   
                // }

            })
            .addCase(fetchBills.fulfilled, (state, action) => {
                state.billloading = false;
                state.billdata = action.payload?.records;

            })
            .addCase(fetchBills.rejected, (state, action) => {
                state.billloading = false;
                state.billerror = action.error.message;
            });
    },
});
export const { resetBill, deleteBillItem,addBillItem } = billSlice.actions;
export default billSlice.reducer;
