import { createSlice } from "@reduxjs/toolkit";
import { client, setLocalData, getLocalData } from "../utils";

import { showLogin } from "./ui";

const userData = getLocalData("userData");

const user = createSlice({
  name: "user",
  initialState: {
    auth: userData?.auth,
    username: userData?.username,
    userid: userData?.userid,
    token: userData?.token,
    error: false,
  },
  reducers: {
    authSuccess(state, action) {
      state.auth = true;
      state.username = action.payload.username;
      state.userid = action.payload.userid;
      state.token = action.payload.token;
    },
    authFail(state, action) {
      state.auth = false;
      state.error = true;
    },
    logout(state, action) {
      state.auth = false;
      state.username = null;
      state.userid = null;
      state.token = null;
      state.err = false;
    },
  },
});

const { authSuccess, authFail, logout } = user.actions;

const auth = (_username, password) => async (dispatch) => {
  try {
    const res = await client.post(`https://elma.online/token`, {
      kuski: _username,
      password,
    });

    const { success, username, userid, token } = res.data.Response;

    if (success) {
      setLocalData("userData", { auth: true, username, userid, token });
      dispatch(authSuccess({ auth: true, username, userid, token }));
      dispatch(showLogin(false));
    } else {
      dispatch(authFail());
    }
  } catch (err) {
    console.log(err);
  }
};

export { auth, logout };

export default user.reducer;
