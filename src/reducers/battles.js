import { createSlice, createSelector } from "@reduxjs/toolkit";
import { client, sortResults, formatTime } from "../utils";

const battles = createSlice({
  name: "battles",
  initialState: {
    list: [],
    map: {},
  },
  reducers: {
    getBattlesSuccess(state, action) {
      state.list = action.payload.map((b) => b.id);
      action.payload.forEach((b) => {
        state.map[b.id] = {
          ...b,
        };
      });
    },
    getBattleSuccess(state, action) {
      state.map[action.payload.id] = {
        ...action.payload,
      };
    },
  },
});

const { getBattlesSuccess, getBattleSuccess } = battles.actions;

const fetchBattles = (date = "2020-01-15") => async (dispatch) => {
  try {
    const data = await client.get(
      `https://elma.online/api/battle/date/${date}`,
      true
    );
    if (data) dispatch(getBattlesSuccess(data.map(battleMap)));
  } catch (err) {
    console.log(err);
  }
};

const fetchBattle = (id) => async (dispatch) => {
  try {
    const data = await client.get(
      `https://elma.online/api/battle/byBattleIndex/${id}`
    );

    if (data) dispatch(getBattleSuccess(battleMap(data)));
  } catch (err) {
    console.log(err);
  }
};

const battleMap = (b) => ({
  id: b.BattleIndex,
  type: b.BattleType,
  finished: b.Finished,
  queued: b.InQueue,
  started: b.StartedUtc,
  duration: b.Duration,
  level: {
    filename: b.LevelData.LevelName,
    name: b.LevelData.LongName,
    id: b.LevelIndex,
  },
  designer: {
    name: b.KuskiData.Kuski,
    team: b.KuskiData.TeamData?.Team,
  },
  results: b.Results.sort(sortResults(b.BattleType)).map((r) => ({
    name: r.KuskiData.Kuski,
    team: r.KuskiData.TeamData?.Team,
    time: formatTime(r.Time, r.Apples),
    timeRaw: r.Time,
    apples: r.Apples,
    timeIndex: r.TimeIndex,
  })),
});

const selectBattles = createSelector([(state) => state.battles], (battles) =>
  battles.list.map((b) => ({
    ...battles.map[b],
  }))
);

export { fetchBattles, fetchBattle, selectBattles };

export default battles.reducer;
