import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { client, getLocalData } from "../utils";

const replays = createSlice({
  name: "replays",
  initialState: {
    list: [],
    map: {},
    comments: {},
    byLevel: {},
  },
  reducers: {
    getReplaysSuccess(state, action) {
      state.list = action.payload.filter((r) => r.UUID).map((r) => r.UUID);
      action.payload.forEach((r) => {
        state.map[r.UUID] = {
          ...r,
        };
      });
    },
    getReplaySuccess(state, action) {
      state.map[action.payload.UUID] = action.payload;
    },
    getReplayCommentsSuccess(state, action) {
      state.comments[action.payload.id] = action.payload.data;
    },
    getLevelReplaysSuccess(state, action) {
      state.byLevel[action.payload.levelId] = action.payload.data.map(
        (r) => r.UUID
      );
      action.payload.data.forEach((r) => {
        state.map[r.UUID] = {
          ...r,
        };
      });
    },
  },
});

const {
  getReplaysSuccess,
  getReplaySuccess,
  getReplayCommentsSuccess,
  getLevelReplaysSuccess,
} = replays.actions;

const fetchReplays = (offset = 0) => async (dispatch) => {
  try {
    const response = await axios.get(
      `https://api.elma.online/api/replay?page=${offset}&pageSize=50`
    );
    dispatch(getReplaysSuccess(response.data.rows));
  } catch (err) {
    console.log(err);
  }
};

const fetchReplay = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
      `https://api.elma.online/api/replay/byUUID/${id}`
    );
    dispatch(getReplaySuccess(response.data));
  } catch (err) {
    console.log(err);
  }
};

const fetchReplayComments = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
      `https://api.elma.online/api/replay_comment/${id}`
    );
    dispatch(getReplayCommentsSuccess({ id, data: response.data }));
  } catch (err) {
    console.log(err);
  }
};

const fetchLevelReplays = (levelId) => async (dispatch) => {
  try {
    const response = await axios.get(
      `https://api.elma.online/api/replay/byLevelIndex/${levelId}`
    );
    dispatch(getLevelReplaysSuccess({ levelId, data: response.data }));
  } catch (err) {
    console.log(err);
  }
};

const addComment = (id, message) => async (dispatch) => {
  try {
    const { token } = getLocalData("userData");
    await client.post(
      `https://api.elma.online/api/replay_comment/add`,
      {
        ReplayIndex: id,
        Text: message,
        Entered: Math.floor(new Date().getTime() / 1000),
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    dispatch(fetchReplayComments(id));
  } catch (err) {
    console.log(err);
  }
};

const upload = async (
  data,
  filename,
  drivenBy,
  drivenById,
  description,
  tags,
  unlisted
) => {
  try {
    const { token } = getLocalData("userData");
    const formData = new FormData();
    formData.append("file", data);
    formData.append("filename", filename);

    const response = await client.post(
      "https://api.elma.online/upload/replay",
      formData,
      {
        headers: {
          authorization: token,
        },
      }
    );
    const {
      LevelIndex,
      MD5,
      file,
      finished,
      time,
      uuid,
      error,
    } = response.data;

    if (error) throw new Error("could not upload");

    const updateResponse = await client.post(
      "https://api.elma.online/api/replay",
      {
        Bug: 0,
        Comment: description,
        DrivenBy: drivenById,
        DrivenByText: drivenBy,
        Finished: finished,
        LevelIndex: LevelIndex,
        MD5: MD5,
        Nitro: 0,
        RecFileName: file,
        ReplayTime: time,
        TAS: 0,
        Tags: tags.map((t) => ({
          TagIndex: t.id,
          Name: t.name,
          Hidden: t.hidden,
        })),
        UUID: uuid,
        Unlisted: unlisted,
        Uploaded: Math.floor(new Date().getTime() / 1000),
        UploadedBy: 0,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    return updateResponse.data;
  } catch (err) {
    console.log(err);
  }
};

export {
  fetchReplays,
  fetchReplay,
  fetchReplayComments,
  addComment,
  fetchLevelReplays,
  upload,
};

export default replays.reducer;
