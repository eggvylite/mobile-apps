import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import accountSlice from '../slices/accountSlice'
import activePlanSlice from '../slices/activePlanSlice'
import advanceTransSlice from '../slices/advanceTransSlice'
import appcolorSlice from '../slices/appcolorSlice'
import authSlice from '../slices/authSlice'
import bankSlice from '../slices/bankSlice'
import billSlice from '../slices/billSlice'
import brandlogoSlice from '../slices/brandlogoSlice'
import budgetcategorySlice from '../slices/budgetcategorySlice'
import categorySlice from '../slices/categorySlice'
import chooseplanSlice from '../slices/choosePlanSlice'
import customerSlice from '../slices/customerSlice'
import dashboardmenuSlice from '../slices/dashboardmenuSlice'
import elgibleofferSlice from '../slices/elgibleofferSlice'
import getmanulaccountSlice from '../slices/getmanulaccountSlice'
import getnameAccountSlice from '../slices/getnameAccountSlice'
import goalhisSlice from '../slices/goalhisSlice'
import goalSlice from '../slices/goalSlice'
import labelSlice from '../slices/labelSlice'
import manualaccountSlice from '../slices/manualaccountSlice'
import menuiconSlice from '../slices/menuiconSlice'
import newstatementSlice from '../slices/newstatementSlice'
import notificationCustomSlice from '../slices/notificationCustomSlice'
import notificationSlice from '../slices/notificationSlice'
import notificonnectSlice from '../slices/notificonnectSlice'
import offerHandSlice from '../slices/offerHandSlice'
import offerSlice from '../slices/offerSlice'
import offertypeSlice from '../slices/offertypeSlice'
import openofferSlice from '../slices/openofferSlice'
import paymentSlice from '../slices/paymentSlice'
import reminderSlice from '../slices/reminderSlice'
import scoreSlice from '../slices/scoreSlice'
import statementSlice from '../slices/statementSlice'
import subscriptionSlice from '../slices/subscriptionSlice'
import tagdescriptionSlice from '../slices/tagdescriptionSlice'
import tagSlice from '../slices/tagSlice'
import transactionSlice from '../slices/transactionSlice'
import advanceSlice from '../slices/advenceSlice'
import faqSlice from '../slices/faqSlice'
import workflowLabelSlice from '../slices/workflowlableSilce'
import applabelsSlice from '../slices/applabelsSlice'
import merketplaceSlice from '../slices/merketplaceSlice'
import handpicheckSlice from '../slices/handpicheckSlice'
import insightSlice from '../slices/insightSlice';
import { reduxStorage } from './storage';

const appReducer = combineReducers({
  account: accountSlice,
  activeplan: activePlanSlice,
  advancehistory: advanceTransSlice,
  advance: advanceSlice,
  appcolor: appcolorSlice,
  auth: authSlice,
  bank: bankSlice,
  bill: billSlice,
  brandlogo: brandlogoSlice,
  budgetcategory: budgetcategorySlice,
  category: categorySlice,
  chooseplan: chooseplanSlice,
  customer: customerSlice,
  dashboardmenu: dashboardmenuSlice,
  elgible: elgibleofferSlice,
  getaccount: getmanulaccountSlice,
  getaccountname: getnameAccountSlice,
  goalhistrory: goalhisSlice,
  goal: goalSlice,
  labels: labelSlice,
  manualaccount: manualaccountSlice,
  menuicons: menuiconSlice,
  updateStatement: newstatementSlice,
  notificationcustom: notificationCustomSlice,
  notification: notificationSlice,
  notificonect: notificonnectSlice,
  handpicks: offerHandSlice,
  offers: offerSlice,
  offerstype: offertypeSlice,
  openoffers: openofferSlice,
  payment: paymentSlice,
  reminder: reminderSlice,
  creditScore: scoreSlice,
  statement: statementSlice,
  subscription: subscriptionSlice,
  tagdescription: tagdescriptionSlice,
  taglist: tagSlice,
  transaction: transactionSlice,
  faq: faqSlice,
  workflowLabel: workflowLabelSlice,
  appscreenlabels: applabelsSlice,
  marketplace: merketplaceSlice,
  handpicheck: handpicheckSlice,
  insights: insightSlice
})

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = {
      menuicons: state.menuicons,
      appcolor: state.appcolor,
      labels:state.labels
    };
  }

  return appReducer(state, action);
};

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: [
    'account',
    'appcolor',
    'auth',
    'bank',
    'bill',
    'brandlogo',
    'budgetcategory',
    'category',
    'chooseplan',
    'customer',
    'dashboardmenu',
    'getaccount',
    'getaccountname',
    'goalhistrory',
    'goal',
    'labels',
    'manualaccount',
    'menuicons',
    'notificationcustom',
    'notification',
    'reminder',
    'creditScore',
    'statement',
    'subscription',
    'tagdescription',
    'taglist',
    'transaction',
    'handpicheck',
    'faq'
  ],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);




