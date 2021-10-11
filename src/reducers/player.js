import { createSlice } from "@reduxjs/toolkit";

const player = createSlice({
  name: "player",
  initialState: {
    recUrl: "",
    levUrl: "",
  },
  reducers: {
    loadRec(state, action) {
      state.recUrl = action.payload.recUrl;
      state.levUrl = action.payload.levUrl;
    },
  },
});

const { loadRec } = player.actions;

export { loadRec };

export default player.reducer;
