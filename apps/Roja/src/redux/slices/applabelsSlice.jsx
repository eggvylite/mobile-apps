import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../service/api";

export const fetchScreenLabels = createAsyncThunk(
    "labels/fetchLabels",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("labels/getlabels");
            return response?.data.records
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const labelsSlice = createSlice({
    name: "appscreenlabels",
    initialState: {
        byScreen: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchScreenLabels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchScreenLabels.fulfilled, (state, action) => {
                state.loading = false;
                state.byScreen = action?.payload

            })
            .addCase(fetchScreenLabels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default labelsSlice.reducer;