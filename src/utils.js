import { useState, useEffect } from "react";
import DateFnsAdapter from "@date-io/date-fns";
import axios from "axios";

export const dateFns = new DateFnsAdapter();

const getOrientation = () => window.screen.orientation.type;

const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState(getOrientation());

  const updateOrientation = () => {
    setOrientation(getOrientation());
  };

  useEffect(() => {
    window.addEventListener("orientationchange", updateOrientation);
    return () => {
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  return (
    orientation === "landscape-primary" || orientation === "landscape-secondary"
  );
};

const requestCache = new Map();

const requestGet = async (url, noCache) => {
  const c = requestCache.get(url);
  if (c && !noCache) {
    return;
  } else {
    requestCache.set(url, { loading: true });
    const res = await axios.get(url);

    requestCache.set(url, {
      loading: false,
      data: res.data,
      callbacks: [],
    });

    return res.data;
  }
};

const client = {
  get: requestGet,
  post: axios.post,
  get instance() {
    return axios;
  },
};

const setLocalData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log(e);
  }
};

const getLocalData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    console.log(e);
  }
};

const removeLocalData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};

const reversedBattleTypes = ["SL", "SR", "FT"];

const sortResults = (battleType) => (a, b) => {
  if (a.Time && b.Time) {
    const c = reversedBattleTypes.find((t) => t === battleType)
      ? b.Time - a.Time
      : a.Time - b.Time;
    return c === 0 ? a.TimeIndex - b.TimeIndex : c;
  }
  if (a.Time === 0 && b.Time !== 0) return 1;
  if (b.Time === 0 && a.Time !== 0) return -1;
  const d = b.Apples - a.Apples;
  return d === 0 ? a.BattleTimeIndex - b.BattleTimeIndex : d;
};

const thousandsValues = [1000, 59999, 60000, 3, 3600000];
const hundredsValues = [100, 5999, 6000, 2, 360000];

const formatTime = (time, apples, thousands = false) => {
  // for cup results
  if (apples === -1) {
    if (time === 9999100) {
      return "0 apples";
    }
    if (time >= 999900 && time <= 999999) {
      return `${1000000 - time} apple${1000000 - time !== 1 ? `s` : ``}`;
    }
    if (time >= 9999000 && time <= 9999999) {
      return `${10000000 - time} apple${10000000 - time !== 1 ? `s` : ``}`;
    }
  }
  if (time === 0) {
    return `${apples} apple${apples !== 1 ? `s` : ``}`;
  }

  let values = hundredsValues;
  if (thousands) {
    values = thousandsValues;
  }
  const string = `${Math.floor((time / values[0]) % 60)
    .toString()
    .padStart(time > 999 ? 2 : 1, 0)},${(time % values[0])
    .toString()
    .padStart(values[3], 0)}`;

  if (time > values[4]) {
    const hours = Math.floor((time / values[4]) % 60);
    return `${hours}:${Math.floor(time / values[2] - hours * 60)
      .toString()
      .padStart(2, 0)}:${string}`;
  }

  if (time > values[1]) {
    return `${Math.floor(time / values[2])}:${string}`;
  }

  return string;
};

export {
  useScreenOrientation,
  client,
  sortResults,
  formatTime,
  setLocalData,
  getLocalData,
  removeLocalData,
};
