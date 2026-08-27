import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';



export const fetchcreditScore = createAsyncThunk('creditScore/fetchcreditScore', async (res) => {
    var info = await getLoginInfo()
    const response = await api.get("settings/score/" + info.id)
    return response.data;

});
const initialState = {
    scoredata: '',
    scoreloading: false,
    scorerror: null,
};

const scoreSlice = createSlice({
    name: 'creditScore',
    initialState,
    reducers: {
        resetCreditscore: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchcreditScore.pending, (state) => {
                state.scoreloading = false;
            })
            .addCase(fetchcreditScore.fulfilled, (state, action) => {
                state.scoreloading = false;
                state.scoredata = action.payload;
            })
            .addCase(fetchcreditScore.rejected, (state, action) => {
                state.scoreloading = false;
                state.scorerror = action.error.message;
            });
    },
});

export const { resetCreditscore } = scoreSlice.actions;
export default scoreSlice.reducer;