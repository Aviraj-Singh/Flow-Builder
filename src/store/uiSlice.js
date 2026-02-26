import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showJson: true,
    showImport: false,
    toast: null, // { msg: string, type: 'success' | 'error' }
  },
  reducers: {
    toggleJson(state) {
      state.showJson = !state.showJson;
    },
    setShowImport(state, action) {
      state.showImport = action.payload;
    },
    showToast(state, action) {
      state.toast = action.payload; // { msg, type }
    },
    clearToast(state) {
      state.toast = null;
    },
  },
});

export const { toggleJson, setShowImport, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
