import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';



export const fetchReminder = createAsyncThunk('reminder/fetchReminder', async (res) => {
    const info = await getLoginInfo()
    const response = await api.get(`dashboard/fetchreminder/${info.id}`);
    return response.data;

});
const initialState = {
    reminderdata: [],
    reminderoading: false,
    remindererror: null,
};

const reminderSlice = createSlice({
    name: 'reminder',
    initialState,
    reducers: {
        resetReminder: (state) => {
            return initialState;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReminder.pending, (state) => {
                if (0 < state.reminderdata.length) {
                    state.reminderoading = false;
                } else {
                    state.reminderoading = true;
                }

            })
            .addCase(fetchReminder.fulfilled, (state, action) => {
                state.reminderoading = false;
                state.reminderdata = action.payload;

            })
            .addCase(fetchReminder.rejected, (state, action) => {
                state.reminderoading = false;
                state.remindererror = action.error.message;
            });
    },
});
export const { resetReminder } = reminderSlice.actions;
export default reminderSlice.reducer;
