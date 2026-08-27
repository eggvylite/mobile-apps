import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';
import { getLoginInfo } from '../../service/storage';


export const fetchHandpickCheck = createAsyncThunk('handpicheck/fetchHandpickCheck', async ({ code }) => {

    try {
        var info = await getLoginInfo()
        const response = await api.get(`productsignal/getauditresponse/${info?.id}/${code}`)
        console.log(response.data)
        return response.data;
    } catch(err) {
        console.log(err.response)
        return  err.message
    }
  
});

const initialState = {
    handpickcheckdata: '',
    handpickcheckloading: false,
    handpickcheckerror: null
}

const handpicheckSlice = createSlice({
    name: "handpicheck",
    initialState,
    reducers: {
        resetHandpickcheck: (state) => {
            return initialState;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHandpickCheck.pending, (state) => {
                state.handpickcheckloading = true

            })
            .addCase(fetchHandpickCheck.fulfilled, (state, action) => {
                state.handpickcheckloading = false
                state.handpickcheckdata = action.payload
            })
            .addCase(fetchHandpickCheck.rejected, (state) => {
                state.handpickcheckloading = false;
                state.handpickcheckerror = 'error'
            });

    },
});

export const { resetHandpickcheck } = handpicheckSlice.actions;
export default handpicheckSlice.reducer;