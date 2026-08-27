import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';

/* ============================
   DEFAULT THEME DATA
============================ */
const defaultTheme = {
  backgroundcolor: '#fff',
  badge: '#dbdbdb',
  badge_text: '#1c1c1c',
  barbg: '#cbbdff',
  bg_light_text: '#ffffff',
  bgbtn: '#df646f',
  bglight: '#4d4d4d',
  bottom_menu_bg: '#343434',
  box_shadow: '#0d0d0d',
  btn_text_color: '#ffffff',
  btnborder: '#595959',
  btndisable: '#5c5c5c',
  card_list_bg: '#4d4d4d',
  card_secondary_color: '#ffffff',
  card_text_color: '#ffffff',
  cardbg: '#3d3d3d',
  chartexpenses: '#f3afaf',
  chartincome: '#bdffc1',
  danger: '#fe4d4d',
  dark: '#000000',
  gradient: 'No',
  gradient_top: '#1f1f1f',
  gradient_bottom: '#212121',
  gradient_secondary_top: '#ffffff',
  gradient_secondary_bottom: '#ffffff',
  iconbg: '#333333',
  iconcolor: '#ffffff',
  inputprimary: '#383838',
  inputsecondary: '#eee7e7',
  light: '#f3f6f9',
  menu_active_bg: '#ffffff',
  menuactive: '#df646f',
  menuinactive: '#bfbfbf',
  nav_background: '#343434',
  payment_card_bg: '#4f4f4f',
  statusbar: '#363636',
  success: '#1cca96',
  tab_active_bg: '#df646f',
  tab_active_text: '#ffffff',
  tabbg: '#4d4d4d',
  text_primary: '#ffffff',
  text_secondary: '#ffffff',
  textlight: '#ffffff',
  warning: '#ffc107',
  white: '#ffffff',
};


export const fetchcolor = createAsyncThunk(
  'color/fetchAppColor',
  async (res) => {
    try {
      const response = await api.get('theme/get');
      return response.data;
    } catch (error) {
      return res.rejectWithValue(error || 'Theme fetch failed');
    }
  }
);


const initialState = {
  themedata: {
    Success: 'No',
    gradient: 'No',
    logo: require('../../../assets/images/app-logo.png'),
    theme_logo: '',
    theme: {
      ...defaultTheme,
      primary_gradient: [
        defaultTheme.gradient_top,
        defaultTheme.gradient_top,
        defaultTheme.gradient_bottom,
      ],
      secondary_gradient: [
        defaultTheme.gradient_secondary_top,
        defaultTheme.gradient_secondary_top,
        defaultTheme.gradient_secondary_bottom,
      ],
    },
  },
  themeloading: false,
  themeerror: null,
};

/* ============================
   SLICE
============================ */
const activecolor = createSlice({
  name: 'appcolor',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchcolor.pending, (state) => {
        state.themeloading = true;
        state.themeerror = null;
      })

      .addCase(fetchcolor.fulfilled, (state, action) => {
        const apiTheme = action.payload?.theme || {};


        state.themeloading = false;
        state.themedata = {
          ...state.themedata, // keep default data
          ...action.payload,
          theme: {
            ...state.themedata.theme,
            ...apiTheme,
            primary_gradient: [
              apiTheme.gradient_top || defaultTheme.gradient_top,
              apiTheme.gradient_top || defaultTheme.gradient_top,
              apiTheme.gradient_bottom || defaultTheme.gradient_bottom,
            ],
            secondary_gradient: [
              apiTheme.gradient_secondary_top || defaultTheme.gradient_secondary_top,
              apiTheme.gradient_secondary_top || defaultTheme.gradient_secondary_top,
              apiTheme.gradient_secondary_bottom || defaultTheme.gradient_secondary_bottom,
            ],
          },
        };
  
      })

      .addCase(fetchcolor.rejected, (state, action) => {
        state.themeloading = false;
        state.themeerror = 'error'
      });
  },
});
export default activecolor.reducer;
