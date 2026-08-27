import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLoginInfo } from "../../service/storage";
import api from "../../service/api";


export const fetchAdvancesListHistory = createAsyncThunk(
    'advancehistory/fetchAdvancesHistoryList',
    async ({ page , size  }, { rejectWithValue }) => {
        

        try {
            var store = await getLoginInfo()
            const response = await api.get(`advances/history/${store.id}?page=${page}&size=${size}`)
            return {
                records: response.data.records,
                currentPage: page,
                totalPages: response.data.totalPages,
                size:size,
                totalItems: response.data.totalItems
            };
            
        } catch (error) {

            console.log(error)
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    advhistory: [],
    advpage: -1,
    advtotalPages: 0,
    advtotalItems: 0,
    advsize:50,
    advloading: false,
    adverror: null,
}

// Slice
const advanceTransSlice = createSlice({
    name: "advancehistory",
    initialState,
    reducers: {
        resetAdvTransaction: (state) => {
            return initialState; // Reset state when logout
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdvancesListHistory.pending, (state) => {
                if (0 < state.advhistory.length) {
                    state.advloading = false;
                } else {
                    state.advloading = true;
                }

                state.adverror = null;
            })
            .addCase(fetchAdvancesListHistory.fulfilled, (state, action) => {
                const { records, currentPage, totalPages, totalItems,size } = action.payload;
  
                if (0 < state.advhistory.length) {
                    state.advhistory = [...state.advhistory, ...records];
                } else {
                    state.advhistory = records;
                }

                state.advpage = currentPage;
                state.advtotalPages = totalPages;
                state.advtotalItems = totalItems
                state.advloading = false
                state.advsize = size

            })
            .addCase(fetchAdvancesListHistory.rejected, (state, action) => {
                state.advloading = false;
                state.adverror = action.payload;
            });
    },
});

export const { resetAdvTransaction } = advanceTransSlice.actions;
export default advanceTransSlice.reducer;
