import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: false,
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export const selectDarkMode = (state) => state.darkMode.darkMode;

export default darkModeSlice.reducer;
