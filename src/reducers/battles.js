import { createSlice, createSelector } from "@reduxjs/toolkit";
import { client, sortResults, formatTime, dateFns, sortRuns } from "../utils";

export const getTimestamp = () => {
  try {
    const t = new URLSearchParams(window.location.search).get("t");
    if (+t) return Number(t);
  } catch (ex) {
    console.log(ex);
  }

  return getToday();
};

export const getToday = () => dateFns.startOfDay(new Date()).getTime();

const battles = createSlice({
  name: "battles",
  initialState: {
    date: getTimestamp(),
    list: {},
    map: {},
    runs: {},
  },
  reducers: {
    getBattlesSuccess(state, action) {
      state.list[action.payload.key] = action.payload.list.map((b) => b.id);
      action.payload.list.forEach((b) => {
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
    resetDate(state) {
      state.date = getToday();
    },
  },
});

const {
  getBattlesSuccess,
  getBattleSuccess,
  getBattleRunsSuccess,
  setDate,
  resetDate,
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
        getBattlesSuccess({
          key: start,
          list: data.map(battleMap).filter((b) => !(b.aborted && !b.started)),
        })
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
  started:
    Number(b.Started) * 1000 +
    (Number(b.Started) > 0 ? Number(b.Countdown || 0) * 1000 : 0),
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
  resetDate,
};

export default battles.reducer;
