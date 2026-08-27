import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';



export const fetchTag = createAsyncThunk('taglist/fetchTag', async () => {
  var loginfo = await getLoginInfo()
  const response = await api.get(`dashboard/statements/${loginfo.id}/tags`)
  return response.data;
});

const initialState = {
  tagdata: '',
  tagloading: false,
  tagerror: null,
};


const tagSlice = createSlice({
  name: 'taglist',
  initialState,
  reducers: {
    resetTag: (state) => {
      return initialState; // Reset state when logout
    },
    updateTagname: (state, action) => {
      state.tagdata = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTag.pending, (state) => {
        if(state.tagdata) {
          state.tagloading = false;
        } else {
          state.tagloading = true;
        }

      })
      .addCase(fetchTag.fulfilled, (state, action) => {
        state.tagloading = false;
        state.tagdata = action.payload;
      })
      .addCase(fetchTag.rejected, (state, action) => {
        state.tagloading = false;
        state.tagerror = action.error.message;
      });
  },
});
export const { resetTag,updateTagname } = tagSlice.actions;
export default tagSlice.reducer;
