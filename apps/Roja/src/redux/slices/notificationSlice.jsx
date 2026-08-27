import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';



export const fetchNotication = createAsyncThunk('notification/fetchNotification', async (page) => {
    var info = await getLoginInfo()
    const response = await api.get("customer/fetchnotification/"+info.id+'?size='+page)
    return response.data;

});
const initialState = {
    notificationdata: {},
    notificationloading: false,
    notificationerror: null,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        resetNotification: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotication.pending, (state) => {
                if(0 < state.notificationdata.records) {
                    state.notificationloading = false;
                } else {
                    state.notificationloading = true;
                }
     
            })
            .addCase(fetchNotication.fulfilled, (state, action) => {
                state.notificationloading = false;
                state.notificationdata = action.payload;
            })
            .addCase(fetchNotication.rejected, (state, action) => {
                state.notificationloading = false;
                state.notificationerror = action.error.message;
            });
    },
});

export const { resetNotification } = notificationSlice.actions;
export default notificationSlice.reducer;