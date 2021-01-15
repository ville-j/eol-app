import { createSlice } from "@reduxjs/toolkit";
import { client } from "../utils";

const replays = createSlice({
  name: "kuskis",
  initialState: {},
  reducers: {
    getKuskiSuccess(state, action) {
      state[action.payload.KuskiIndex] = {
        name: action.payload.Kuski,
        team: action.payload.TeamData?.Team,
      };
    },
  },
});

const { getKuskiSuccess } = replays.actions;

const fetchKuski = (id) => async (dispatch) => {
  try {
    const data = await client.get(`https://elma.online/api/player/${id}`);
    if (data) dispatch(getKuskiSuccess(data));
  } catch (err) {
    console.log(err);
  }
};

export { fetchKuski };

export default replays.reducer;
