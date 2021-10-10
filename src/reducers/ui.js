import { createSlice } from "@reduxjs/toolkit";

const ui = createSlice({
  name: "ui",
  initialState: {
    showLogin: false,
  },
  reducers: {
    showLogin(state, action) {
      state.showLogin = action.payload;
    },
  },
});

const { showLogin } = ui.actions;

export { showLogin };

export default ui.reducer;
