import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLoginInfo } from "../../service/storage";
import api from "../../service/api";


export const fetchOutstanding = createAsyncThunk(
    'advances/fetchOutstanding',
    async (_, { rejectWithValue }) => {

        var store = await getLoginInfo()

        try {
            const response = await api.get('advances/outstandings/' + store.id);

            return response.data.outstandingAdvance;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchadvanceActiveSubscription = createAsyncThunk(
    'subscription/fetchActiveSubscription',
    async (_, { rejectWithValue }) => {
        var store =  await getLoginInfo()

        try {
            const response = await api.get('subscribed_customers/active_subscription/' + store.id);
            return response.data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchadvanceOnedetails = createAsyncThunk(
    'advance/fetchActiveOneSubscription',
    async (currentid, { rejectWithValue }) => {
        var store = await getLoginInfo()

        try {
            const response = await api.get('advances/one/' + currentid);

            return response.data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const  initialState= {
    cusData: null,
    loading: false,
    advances: [],
    allrecord: null,
    totalBill: null,
    error: null,
    storePay: null,
    enabled: false,
    activeSub: null,
    minAmount: null,
    maxAmount: null,
    onTransactiondetails: null

}


const advanceSlice = createSlice({
    name: 'advance',
    initialState: initialState,
    reducers: {

        resetAdvanceState: (state) => {
            return initialState;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOutstanding.pending, (state) => {
                if(state.totalBill !== null) {
                    state.loading = false;
                } else {
                    state.loading = true;
                }

            })
            .addCase(fetchOutstanding.fulfilled, (state, action) => {
                state.loading = false;
                state.totalBill = action.payload;
            })
            .addCase(fetchOutstanding.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //check active subscription service

            .addCase(fetchadvanceActiveSubscription.pending, (state) => {
                if(state.activeSub !== null) {
                    state.loading = false;
                } else {
                    state.loading = true;
                }

            })

            .addCase(fetchadvanceActiveSubscription.fulfilled, (state, action) => {
                state.loading = false;
                state.enabled = action.payload?.status === 'Active' ? true : false;
                state.activeSub = action.payload || null;
                state.minAmount = action.payload?.plan_cash_min || null;
                state.maxAmount = (action.payload?.plan_cash_upto - action.payload?.used_advance) || null;
            })

            // .addCase(fetchActiveSubscription.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.enabled = action.payload.data.status == 'Active' ? true : false;
            //     state.activeSub = action.payload| null
            //     state.minAmount = action.payload?.plan_cash_min | null
            //     state.maxAmount = action.payload?.plan_cash_upto - action.payload?.data.used_advance | null
            // })
            .addCase(fetchadvanceActiveSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(fetchadvanceOnedetails.pending, (state) => {
                    state.loading = true;
            })
            .addCase(fetchadvanceOnedetails.fulfilled, (state, action) => {
                state.loading = false;
                state.onTransactiondetails = action.payload;

            })
            .addCase(fetchadvanceOnedetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});


export const { resetAdvanceState } = advanceSlice.actions;
export default advanceSlice.reducer;