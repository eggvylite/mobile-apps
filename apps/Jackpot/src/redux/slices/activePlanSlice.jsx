import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';




export const fetchactivePlan = createAsyncThunk('activePlan/fetchactivePlan', async (res) => {
    var info = await getLoginInfo()
    const response = await api.get("subscribed_customers/active_subscription/"+info.id)
    return response.data;

});
const initialState = {
    activeplandata: '',
    activeplaneloading: false,
    activeplaneerror: null,
};

const activePlanSlice = createSlice({
    name: 'activeplan',
    initialState,
    reducers: {
        resetActivePlan: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchactivePlan.pending, (state) => {
                state.activeplaneloading = false;
            })
            .addCase(fetchactivePlan.fulfilled, (state, action) => {
                state.activeplaneloading = false;
                state.activeplandata = action.payload;
            })
            .addCase(fetchactivePlan.rejected, (state, action) => {
                state.activeplaneloading = false;
                state.activeplaneerror = action.error.message;
            });
    },
});

export const { resetActivePlan } = activePlanSlice.actions;
export default activePlanSlice.reducer;