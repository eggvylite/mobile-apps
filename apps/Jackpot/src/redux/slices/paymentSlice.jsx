import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLoginInfo } from "../../service/storage";
import api from "../../service/api";


export const fetchPaymentMethods = createAsyncThunk(
    "payment/fetchMethods",
    async (_, { rejectWithValue }) => {

        const user = await getLoginInfo()

        try {
            const response = await api.get("customer/" + user.id + "/paymentcards/get");


            return response?.data?.list;
        } catch (err) {

            return rejectWithValue(err.response?.data || "Failed to fetch payment methods");
        }
    }
);

   const initialState ={
        paymentMethods: [],
        paymentloading: false,
        paymenterror: null,
        defcardpm:''
    }

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {

        clearpaymentDetails: (state) => {
            return initialState; // Reset state when logout
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentMethods.pending, (state) => {
                state.paymentloading = true;
                state.paymenterror = null;
            })
            .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
                state.paymentMethods = action.payload || [];
                const defcard = action.payload ?.find((obj) => obj.default?.toLowerCase() === 'yes')
                state.defcardpm = defcard?.pm_id || ''
                state.paymentloading = false;
            })
            .addCase(fetchPaymentMethods.rejected, (state, action) => {
                state.paymentloading = false;
                state.paymenterror = action.payload;
            });
    },
});


export const { clearpaymentDetails } = paymentSlice.actions;
export default paymentSlice.reducer;
