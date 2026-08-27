import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';


export const fetchCategory = createAsyncThunk('category/fetchCategory', async (res) => {
    const user = await  getLoginInfo()
    const response = await api.get('dashboard/statements/' + user?.id + '/category')
    return response.data;

});
const initialState = {
    categorydata: '',
    categoryloading: false,
    categoryerror: null,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        resetCategory: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategory.pending, (state) => {
                if (state.categorydata) {
                    state.categoryloading = false;
                } else {
                    state.categoryloading = true;
                }

            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.categoryloading = false;
                state.categorydata = action.payload;
            })
            .addCase(fetchCategory.rejected, (state, action) => {
                state.categoryloading = false;
                state.categoryerror = action.error.message;
            });
    },
});
export const { resetCategory } = categorySlice.actions;
export default categorySlice.reducer;
