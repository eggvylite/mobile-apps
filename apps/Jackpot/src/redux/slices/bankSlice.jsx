import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';



export const fetchBank = createAsyncThunk('bank/fetchBank', async (res) => {
    const info = await getLoginInfo()
    const response = await api.get(`dashboard/statements/${info?.id}/banks`);
    return response.data;

});
const initialState = {
    bankdata: '',
    defbank: '',
    bankloading: false,
    bankerror: null,
};

const bankSlice = createSlice({
    name: 'bank',
    initialState,
    reducers: {
        resetBank: (state) => {
            return initialState; // Reset state when logout
        },
        updateBank: (state, action) => {
            state.bankdata = action.payload;
            defbank = action.payload.records.find((obj) => obj.bank_default === 'Yes')
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBank.pending, (state) => {
                state.bankerror = null;
                if (state.bankdata) {
                    state.bankloading = false;
                } else {
                    state.bankloading = true;
                }

            })
            .addCase(fetchBank.fulfilled, (state, action) => {
                state.bankloading = false;
                state.bankdata = action.payload;
                state.defbank = action.payload.records.find((obj) => obj.bank_default === 'Yes')
            })
            .addCase(fetchBank.rejected, (state, action) => {
                state.bankloading = false;
                state.bankerror = action.error.message;
            });
    },
});
export const { resetBank, updateBank } = bankSlice.actions;
export default bankSlice.reducer;
