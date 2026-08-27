import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLoginInfo } from "../../service/storage";
import api from "../../service/api";

export const fetchMarketplace = createAsyncThunk(
  "marketplace/fetchMarketplace",
  async (_, { rejectWithValue }) => {
    try {
      const loginfo = await getLoginInfo();

      const response = await api.get(
        `dashboard/statements/${loginfo?.id}/marketplace_offers`
      );

      return response.data?.records || [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Something went wrong"
      );
    }
  }
);

export const fetchMarketplaceCategory = createAsyncThunk(
  "marketplace/fetchMarketplaceCategory",
  async (_, { rejectWithValue }) => {
    try {
      const loginfo = await getLoginInfo();

      const response = await api.get(
        `dashboard/statements/${loginfo?.id}/marketplace_category`
      );

      return response.data?.records || [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Something went wrong"
      );
    }
  }
);



export const fetchMarketplaceFeatures = createAsyncThunk(
  'marketplace/fetchMarketplaceFeatures',
  async (_, { rejectWithValue }) => {
    try {
      const loginfo = await getLoginInfo();

      const response = await api.get(
        `dashboard/statements/${loginfo?.id}/marketplace_features`,
      );

      return response.data?.records || [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || 'Something went wrong',
      );
    }
  },
);

export const fetchMarketplaceHandPickOffer = createAsyncThunk(
  'marketplaceHandpick/fetchMarketplaceHandPickOffer',
  async (_, { rejectWithValue }) => {
    try {
      const loginfo = await getLoginInfo();

      const response = await api.get(
        `dashboard/statements/${loginfo?.id}/marketplace_handpick_only`,
      );

      return response.data?.records || [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || 'Something went wrong',
      );
    }
  },
);


const initialState = {
  marketplacedata: [],
  marketPlaceCategory: [],
  marketplaceFeature:[],
  marketPlaceHandpickOffer:[],
  loading: false,
  error: null,
};

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,

  reducers: {
    resetMarketplace: () => initialState,

    updateMarketplace: (state, action) => {
      state.marketplacedata = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Marketplace Offers
      .addCase(fetchMarketplace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketplace.fulfilled, (state, action) => {
        state.loading = false;
        state.marketplacedata = action.payload;
        state.error = null;
      })
      .addCase(fetchMarketplace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Marketplace Category
      .addCase(fetchMarketplaceCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketplaceCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.marketPlaceCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchMarketplaceCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })


      // Marketplace Category
      .addCase(fetchMarketplaceFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketplaceFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.marketplaceFeature = action.payload;
        state.error = null;
      })
      .addCase(fetchMarketplaceFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Marketplace Category
      .addCase(fetchMarketplaceHandPickOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketplaceHandPickOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.marketPlaceHandpickOffer = action.payload;
        state.error = null;
      })
      .addCase(fetchMarketplaceHandPickOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  resetMarketplace,
  updateMarketplace,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;