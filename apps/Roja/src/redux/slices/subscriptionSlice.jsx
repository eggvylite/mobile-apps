import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLoginInfo } from "../../service/storage";
import api from "../../service/api";


export const fetchcurrentsubscription = createAsyncThunk(
    "currentsubscription/fetchData",
    async (_, { rejectWithValue }) => {

        const user = await getLoginInfo()

        try {
            const response = await api.get(
                "advances/subscription/" + user.id
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);


export const fetchSubscriptionDetails = createAsyncThunk(
    "subscription/fetchDetails",
    async (currentPage, { rejectWithValue }) => {
        const user = await getLoginInfo()

        try {
            const response = await api.get('subscribed_customers/findAll/' + user.id + '?page=0&size=' + 10
            );

            return response.data.records


        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);







export const fetchSubscriptionDetaillist = createAsyncThunk(
    "subscription/fetchDetail",
    async (subid, { rejectWithValue }) => {
        try {
            const response = await api.get(
                'subscribed_customers/get_one/' + subid,

            );

            return {
                transaction: response.data.history,
                subDetails: response.data.data,
            };
        } catch (error) {

            console.log(error, '=====')
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const initialState = {
    subscription: null,
    subloading: false,
    subdetailloading: false,
    subdetailslistloading: false,
    allsubscription: [],
    transaction: [],
    subscriptionfeature: [],
    subDetails: null,
    subInfo: null,
    error: null
}

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        clearsubscription: (state) => {
            return initialState; // Reset state when logout
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchcurrentsubscription.pending, (state) => {
                state.subloading = true;

            })
            .addCase(fetchcurrentsubscription.fulfilled, (state, action) => {
                state.subloading = false;
                state.subscription = action.payload;
            })
            .addCase(fetchcurrentsubscription.rejected, (state, action) => {
                state.subloading = false;
                state.error = action.payload;
            })


            // getsubscription details

            .addCase(fetchSubscriptionDetails.pending, (state) => {
                state.subdetailloading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionDetails.fulfilled, (state, action) => {
                state.subdetailloading = false;
                state.allsubscription = action.payload;

            })
            .addCase(fetchSubscriptionDetails.rejected, (state, action) => {
                state.subdetailloading = false;
                state.error = action.payload;
            })

            // View Subscription details

            .addCase(fetchSubscriptionDetaillist.pending, (state) => {
                state.subdetailslistloading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionDetaillist.fulfilled, (state, action) => {
                state.subdetailslistloading = false;
                state.transaction = action.payload.transaction;
                state.subDetails = action.payload.subDetails;
            })
            .addCase(fetchSubscriptionDetaillist.rejected, (state, action) => {
                state.subdetailslistloading = false;
                state.error = action.payload;
            })


    },
});

export const { clearsubscription } = subscriptionSlice.actions
export default subscriptionSlice.reducer;