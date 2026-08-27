import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';



export const fetchTagdescription = createAsyncThunk('tagdescription/fetchTagdescription', async () => {
  var loginfo = await getLoginInfo()
  const response = await api.get(`dashboard/statements/${loginfo.id}/tagtransactions`)
  return response.data;
});

const initialState = {
  descripiondata: '',
  descriptionloading: false,
  descriptionerror: null,
};


const tagdescriptionSlice = createSlice({
  name: 'tagdescription',
  initialState,
  reducers: {
    resetTagdescription: (state) => {
      return initialState; // Reset state when logout
    },
    updateTagdescription: (state, action) => {
      state.descripiondata = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTagdescription.pending, (state) => {
        if(state.descripiondata) {
          state.descriptionloading = false;
        } else {
          state.descriptionloading = true;
        }

      })
      .addCase(fetchTagdescription.fulfilled, (state, action) => {
        state.descriptionloading = false;
        state.descripiondata = action.payload;
      })
      .addCase(fetchTagdescription.rejected, (state, action) => {
        state.descriptionloading = false;
        state.descriptionerror = action.error.message;
      });
  },
});
export const { resetTagdescription,updateTagdescription } = tagdescriptionSlice.actions;
export default tagdescriptionSlice.reducer;
