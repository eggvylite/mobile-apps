import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';
import { getLoginInfo } from '../../service/storage';

export const fetchEwf = createAsyncThunk(
    'ewf/fetchEwf',
    async (_, { rejectWithValue }) => {
        try {
            const loginInfo = await getLoginInfo();

            const response = await api.get(
                `/subscribed_customers/ewadet/${loginInfo?.id}`
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || 'Something went wrong'
            );
        }
    }
);

const initialState = {
    ewfInfo: null,
    loading: false,
    error: null,
};

const ewfSlice = createSlice({
    name: 'ewf',
    initialState,

    reducers: {
        resetEwf: () => initialState,

        updateEwf: (state, action) => {
            state.ewfInfo = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchEwf.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchEwf.fulfilled, (state, action) => {
                state.loading = false;
                state.ewfInfo = action.payload;
            })

            .addCase(fetchEwf.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    resetEwf,
    updateEwf,
} = ewfSlice.actions;

export default ewfSlice.reducer;