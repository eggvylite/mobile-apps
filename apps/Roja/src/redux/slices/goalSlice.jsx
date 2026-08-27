import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';
import { getLoginInfo } from '../../service/storage';


export const fetchtargetList = createAsyncThunk('targetlist/fetchtargetList', async (res) => {
    const response = await api.get('contents/targetlists')
    return response.data;
});

export const fetchgoalAccount = createAsyncThunk('getgoalaccountname/fetchgetGoalAccount', async () => {
    var info = await getLoginInfo()
    const response = await api.get(`customer/getgoalAccountslist/${info.id}`)
    return response.data;
});

export const fetchgoallistAccount = createAsyncThunk(
    'getgoallist/fetchgetGoallist',
    async (_, { rejectWithValue }) => {
        try {
            const info = await getLoginInfo()
            const response = await api.get(
                'dashboard/statements/' + info?.id + '/goals',
            );
            return response.data?.records;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

export const fetchgoalwithdrawAccount = createAsyncThunk('getgoalwithdraw/fetchgetGoalwithdrawAccount', async ({ id }) => {
    const response = await api.get(`dashboard/goalwithdraw/${id}`)
    return response.data;
});


const initialState = {
    goalaccount: [],
    goalList: [],
    targetlist: [],
    goalloading: false,
    goalerror: null,
};
const goalSlice = createSlice({
    name: 'goal',
    initialState,
    reducers: {
        resetGoal: (state) => {
            return initialState;
        },
    },
    reducers: {
        addGoalItem(state, action) {
            state.goalList.push(action.payload);
        },
        deleteGoalItem(state, action) {
            state.goalList = state.goalList.filter(
                item => item._id !== action.payload
            );
        },
        updateGoal: (state, action) => {
            const { id, data } = action.payload;
            const index = state.goalList.findIndex(goal => goal._id === id);
            if (index !== -1) {
                state.goalList[index] = {
                    ...state.goalList[index],
                    ...data,
                };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchtargetList.pending, (state) => {
                state.goalloading = true;
            })
            .addCase(fetchtargetList.fulfilled, (state, action) => {
                state.targetlist = action.payload;
            })
            .addCase(fetchtargetList.rejected, (state, action) => {
                state.goalloading = false;
                state.goalerror = action.error.message;
            })
            .addCase(fetchgoalAccount.pending, (state) => {
                state.goalloading = true;
            })
            .addCase(fetchgoalAccount.fulfilled, (state, action) => {
                state.goalloading = false;
                state.goalaccount = action.payload;
            })
            .addCase(fetchgoalAccount.rejected, (state, action) => {
                state.goalloading = false;
                state.goalerror = action.error.message;
            })
            .addCase(fetchgoallistAccount.pending, (state) => {
                state.goalloading = true;
            })
            .addCase(fetchgoallistAccount.fulfilled, (state, action) => {
                state.goalloading = false;
                state.goalList = action.payload;
            })
            .addCase(fetchgoallistAccount.rejected, (state, action) => {
                state.goalloading = false;
                state.goalerror = action.error.message;
            });
    },
});
export const { resetGoal, addGoalItem, deleteGoalItem, updateGoal } = goalSlice.actions;
export default goalSlice.reducer;