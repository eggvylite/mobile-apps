import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';


export const fetchgetAccount = createAsyncThunk(
    'getaccount/fetchgetAccount',
    async (_, { rejectWithValue }) => {
        try {
            const info = await getLoginInfo()
            const response = await api.get(
                'customer/getAccounts/' + info?.id
            );

            return {
                api: 'yes',
                record: response?.data || [],
            };
        } catch (error) {
            return rejectWithValue(error?.message || 'Something went wrong');
        }
    }
);

export const fetchgetllAccount = createAsyncThunk(
    'getaccount/fetchgetllAccount',
    async (_, { rejectWithValue }) => {
        try {
            const info = await getLoginInfo()
            const response = await api.get(
                'customer/getAllAccountslist/' + info?.id
            );

            return response?.data || [];
        } catch (error) {
            return rejectWithValue(error?.message || 'Something went wrong');
        }
    }
);


const initialState = {
    getaccountdata: '',
    allbankaccountlist: [],
    getaccount: [],
    networth: 0,


    getaccountloading: false,
    getAllAccountLoading: false,

    getaccounterror: null,
};


const getmanulaccountSlice = createSlice({
    name: 'getaccount',
    initialState,

    reducers: {
        resetgetAccount: () => initialState,

        updategetAccount: (state, action) => {
            state.getaccount = action.payload || [];
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchgetAccount.pending, (state) => {
                state.getaccountloading = true;
                state.getaccounterror = null;
            })

            .addCase(fetchgetAccount.fulfilled, (state, action) => {
                state.getaccountloading = false;

                state.getaccountdata = action.payload.api;
                state.getaccount = action.payload.record;


                state.networth = action.payload.record.reduce(
                    (sum, item) => sum + (item?.total_type_balance || 0),
                    0
                );
            })

            .addCase(fetchgetAccount.rejected, (state, action) => {
                state.getaccountloading = false;
                state.getaccounterror = action.payload || action.error.message;
            })


            .addCase(fetchgetllAccount.pending, (state) => {
                state.getAllAccountLoading = true;
                state.getaccounterror = null;
            })

            .addCase(fetchgetllAccount.fulfilled, (state, action) => {
                state.getAllAccountLoading = false;
                state.allbankaccountlist = action.payload;
            })

            .addCase(fetchgetllAccount.rejected, (state, action) => {
                state.getAllAccountLoading = false;
                state.getaccounterror = action.payload || action.error.message;
            });
    },
});


export const { resetgetAccount, updategetAccount } =
    getmanulaccountSlice.actions;

export default getmanulaccountSlice.reducer;