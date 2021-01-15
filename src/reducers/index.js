import { combineReducers } from "@reduxjs/toolkit";
import replaysReducer from "./replays";
import kuskisReducer from "./kuskis";
import battlesReducer from "./battles";
import userReducer from "./user";
import uiReducer from "./ui";
import playerReducer from "./player";

const rootReducer = combineReducers({
  replays: replaysReducer,
  kuskis: kuskisReducer,
  battles: battlesReducer,
  user: userReducer,
  ui: uiReducer,
  player: playerReducer,
});

export default rootReducer;
