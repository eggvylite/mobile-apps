import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';



export const fetchChoosePlan = createAsyncThunk('choosePlan/fetchChoosePlan', async (res) => {
    const response = await api.get("providersubs/chooseplan?status=Active&type=Customer&user=admin")
    return response.data;

});
const initialState = {
    plandata: {},
    planeloading: false,
    planeerror: null,
};

const chooseplanSlice = createSlice({
    name: 'chooseplan',
    initialState,
    reducers: {
        resetChoosePlan: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChoosePlan.pending, (state) => {
                if(0 < Object.keys(state.plandata).length) {
                    state.planeloading = true;
                } else {
                    state.planeloading = false;
                }
        
            })
            .addCase(fetchChoosePlan.fulfilled, (state, action) => {
                state.planeloading = false;
                state.plandata = action.payload;
            })
            .addCase(fetchChoosePlan.rejected, (state, action) => {
                state.planeloading = false;
                state.planeerror = action.error.message;
            });
    },
});

export const { resetChoosePlan } = chooseplanSlice.actions;
export default chooseplanSlice.reducer;