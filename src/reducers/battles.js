import { createSlice, createSelector } from "@reduxjs/toolkit";
import { client, sortResults, formatTime, dateFns, sortRuns } from "../utils";

const battles = createSlice({
  name: "battles",
  initialState: {
    date: dateFns.startOfDay(new Date()).getTime(),
    list: [],
    map: {},
    runs: {},
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
    getBattleRunsSuccess(state, action) {
      if (!state.runs[action.payload.id]) state.runs[action.payload.id] = [];
      const l = state.runs[action.payload.id].length;

      state.runs[action.payload.id].push({
        time: new Date().getTime(),
        runs: action.payload.rows.map((r) => {
          return {
            ...r,
            prev:
              l > 0
                ? state.runs[action.payload.id][l - 1].runs.findIndex(
                    (pr) => pr.kuskiIndex === r.kuskiIndex
                  )
                : -1,
          };
        }),
      });

      if (state.runs[action.payload.id].length > 2) {
        state.runs[action.payload.id].shift();
      }
    },
    setDate(state, action) {
      state.date = action.payload;
    },
  },
});

const {
  getBattlesSuccess,
  getBattleSuccess,
  getBattleRunsSuccess,
  setDate,
} = battles.actions;

const fetchBattles = (date) => async (dispatch) => {
  try {
    const data = await client.get(
      `https://api.elma.online/api/battle/date/${date}`,
      true
    );
    if (data) dispatch(getBattlesSuccess(data.map(battleMap)));
  } catch (err) {
    console.log(err);
  }
};

const fetchBattlesBetween = (start, end) => async (dispatch) => {
  const ds = new Date(start).toISOString();
  const de = new Date(end).toISOString();
  try {
    const data = await client.get(
      `https://api.elma.online/api/battle/byPeriod/${ds}/${de}/250`,
      true
    );
    if (data)
      dispatch(
        getBattlesSuccess(
          data.map(battleMap).filter((b) => !(b.aborted && !b.started))
        )
      );
  } catch (err) {
    console.log(err);
  }
};

const fetchBattle = (id) => async (dispatch) => {
  try {
    const data = await client.get(
      `https://api.elma.online/api/battle/byBattleIndex/${id}`
    );

    if (data) dispatch(getBattleSuccess(battleMap(data)));
  } catch (err) {
    console.log(err);
  }
};

const fetchBattleRuns = (id, type) => async (dispatch) => {
  try {
    const data = await client.get(
      `https://api.elma.online/api/battle/allRuns/${id}`,
      true
    );

    if (data)
      dispatch(
        getBattleRunsSuccess({
          id,
          rows: data.rows
            .sort(sortRuns(type))
            .reduce((acc, cur) => {
              const existing = acc.find((k) => k.KuskiIndex === cur.KuskiIndex);

              if (!existing) acc.push(cur);

              return acc;
            }, [])
            .map(runMap),
        })
      );
  } catch (err) {
    console.log(err);
  }
};

const battleMap = (b) => ({
  id: b.BattleIndex,
  type: b.BattleType,
  finished: b.Finished,
  queued: b.InQueue,
  aborted: b.Aborted,
  started: Number(b.Started) * 1000 + Number(b.Countdown || 0) * 1000,
  end:
    Number(b.Started) * 1000 +
    Number(b.Duration) * 60 * 1000 +
    Number(b.Countdown || 0) * 1000,
  duration: Number(b.Duration),
  running: !b.Finished && b.Started && !b.Aborted,
  level: {
    filename: b.LevelData.LevelName,
    name: b.LevelData.LongName,
    id: b.LevelIndex,
  },
  replay: {
    filename: b.RecFileName,
  },
  designer: {
    name: b.KuskiData.Kuski,
    team: b.KuskiData.TeamData?.Team,
  },
  results: b.Results.sort(sortResults(b.BattleType)).map(runMap),
});

const runMap = (r) => ({
  name: r.KuskiData?.Kuski,
  team: r.KuskiData?.TeamData?.Team,
  time: formatTime(r.Time, r.Apples, r.Finished),
  timeRaw: r.Time,
  apples: r.Apples,
  timeIndex: r.TimeIndex,
  kuskiIndex: r.KuskiIndex,
  finished: r.Finished,
});

const selectBattles = createSelector([(state) => state.battles], (battles) =>
  battles.list.map((b) => ({
    ...battles.map[b],
  }))
);

export {
  fetchBattles,
  fetchBattle,
  selectBattles,
  setDate,
  fetchBattlesBetween,
  fetchBattleRuns,
};

export default battles.reducer;
