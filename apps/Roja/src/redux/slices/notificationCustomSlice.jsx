import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';



export const fetchcustomNotication = createAsyncThunk('notificationcustom/fetchcustomNotication', async (_, { rejectWithValue }) => {
    try {
        var info = await getLoginInfo()
        const response = await api.get("customer/notifications/get/"+info.id)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    

});
const initialState = {
    notificationcustomdata: '',
    notificationcustomloading: false,
    notificationcustomerror: null,
};

const notificationCustomSlice = createSlice({
    name: 'notificationcustom',
    initialState,
    reducers: {
        resetNotificationcustom: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchcustomNotication.pending, (state) => {
                if(0 < state.notificationcustomdata?.data) {
                    state.notificationcustomloading = false;
                } else {
                    state.notificationcustomloading = true;
                }
     
            })
            .addCase(fetchcustomNotication.fulfilled, (state, action) => {
                state.notificationcustomloading = false;
                state.notificationcustomdata = action.payload;
            })
            .addCase(fetchcustomNotication.rejected, (state, action) => {
                state.notificationcustomloading = false;
                state.notificationcustomerror = action.error.message;
            });
    },
});

export const { resetNotificationcustom } = notificationCustomSlice.actions;
export default notificationCustomSlice.reducer;