import { configureStore } from '@reduxjs/toolkit';
import flowReducer from './flowSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    flow: flowReducer,
    ui: uiReducer,
  },
});

export default store;
