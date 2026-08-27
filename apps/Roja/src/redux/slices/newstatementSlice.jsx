import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CommonFunction from '../../utill/CommonFunction';
import api from '../../service/api';


export const fetchupdateStatement = createAsyncThunk('updateStatement/fetchupdateStatement', async ({ code }) => {
    const response = await api.get("customer/accountdetails/" + code + "?status_flag=update" + "&platform=" + CommonFunction.getOS() + "&device_name=" + await CommonFunction.getdevicename() + "&ipaddress=" + await CommonFunction.getipaddress())
    return response.data
});

export const fetchupdateeDate = createAsyncThunk('updateStatement/fetchupdateeDate', async ({ code }) => {
    const response = await api.get('customer/update_refreshtime/' + code)
    return response.data;
});

const newstatementSlice = createSlice({
    name: "updateStatement",
    initialState: {
        updateStatement: '',
        dateData: '',
        updateStatementloading: false,
        updateStatementerror: null
    },
    reducers: {
        resetnewStatement: (state) => {
            return initialState;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchupdateStatement.pending, (state) => {
                state.updateStatementloading = true

            })
            .addCase(fetchupdateStatement.fulfilled, (state, action) => {
                state.updateStatementloading = false
                state.updateStatement = action.payload
            })
            .addCase(fetchupdateStatement.rejected, (state) => {
                state.updateStatementloading = false;
            });

            builder
            .addCase(fetchupdateeDate.pending, (state) => {
                state.updateStatementloading = true

            })
            .addCase(fetchupdateeDate.fulfilled, (state, action) => {
                state.updateStatementloading = false
                state.dateData = action.payload
            })
            .addCase(fetchupdateeDate.rejected, (state) => {
                state.updateStatementloading = false;
            });
    },
});

export const { resetnewStatement } = newstatementSlice.actions;
export default newstatementSlice.reducer;