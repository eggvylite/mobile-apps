import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';

export const fetchBudgetcategory = createAsyncThunk('categorybudget/fetchCategorybudegt', async (res) => {

    const login = await getLoginInfo()
    const response = await api.get('dashboard/statements/' + login?.id + '/budgetcategory')

    return response.data;

});
const initialState = {
    budgetcategorydata: '',
    budgetcategoryloading: false,
    budgetcategoryerror: null,
};

const budgetcategorySlice = createSlice({
    name: 'budgetcategory',
    initialState,
    reducers: {
        resetBudgetcategory: (state) => {
            return initialState; // Reset state when logout
        },
        updateBudgetcategory: (state, action) => {
            state.budgetcategorydata = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudgetcategory.pending, (state) => {
                state.budgetcategoryerror = true;

            })
            .addCase(fetchBudgetcategory.fulfilled, (state, action) => {
                state.budgetcategoryloading = false;
                state.budgetcategorydata = action.payload;
            })
            .addCase(fetchBudgetcategory.rejected, (state, action) => {
                state.budgetcategoryloading = false;
                state.budgetcategoryerror = action.error.message;
            });
    },
});

export const { resetBudgetcategory, updateBudgetcategory } = budgetcategorySlice.actions;
export default budgetcategorySlice.reducer;
