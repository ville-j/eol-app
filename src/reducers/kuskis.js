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
    const data = await client.get(`https://api.elma.online/api/player/${id}`);
    if (data) dispatch(getKuskiSuccess(data));
  } catch (err) {
    console.log(err);
  }
};

const fetchKuskiByName = (name) => async (dispatch) => {
  try {
    const response = await client.instance.get(
      `https://api.elma.online/api/player/Kuski/${name}`
    );
    if (response.data) dispatch(getKuskiSuccess(response.data));
  } catch (err) {
    console.log(err);
  }
};

export { fetchKuski, fetchKuskiByName };

export default replays.reducer;
