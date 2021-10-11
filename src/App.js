import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { DatePicker } from "@material-ui/pickers";
import { Route, useHistory, useLocation } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";

import { fetchBattlesBetween, setDate, getToday } from "./reducers/battles";
import { fetchTags } from "./reducers/tags";
import Router from "./Router";
import Navigation from "./components/Navigation";
import TopBar from "./components/TopBar";
import Login from "./components/Login";
import Avatar from "./components/Avatar";
import { showLogin } from "./reducers/ui";

import { dateFns } from "./utils";

import "./App.css";

const BarContent = styled.div`
  margin-right: 12px;
  display: flex;
  flex: 1;
  height: 100%;
  align-items: center;
  > div {
    flex: 1;
    display: flex;
    align-items: center;
    :last-child {
      justify-content: flex-end;
    }
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;

  > div {
    width: 20px;
    height: 20px;
    margin-right: 0.5rem;
  }
`;

const BattleDatePicker = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const date = useSelector((state) => state.battles.date);
  const location = useLocation();
  const t = new URLSearchParams(location.search).get("t");

  useEffect(() => {
    if (t) dispatch(setDate(Number(t)));
    else dispatch(setDate(getToday()));
  }, [dispatch, t]);

  const handleDateChange = (date) => {
    history.push(`/battles?t=${date.getTime()}`);
  };

  useEffect(() => {
    const end = dateFns.addDays(date, 1);
    const interval =
      end > new Date()
        ? setInterval(() => {
            dispatch(fetchBattlesBetween(date, end));
          }, 15000)
        : null;

    dispatch(fetchBattlesBetween(date, end));

    return () => {
      clearInterval(interval);
    };
  }, [dispatch, date]);

  return (
    <div>
      <DatePicker
        variant="inline"
        onChange={handleDateChange}
        format="E dd.MM.yyyy"
        value={date}
        TextFieldComponent={Input}
      />
    </div>
  );
};

const DateContainer = styled.div`
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 110px;
  text-align: center;
`;

const Input = (props) => {
  const history = useHistory();
  const date = useSelector((state) => state.battles.date);

  const handleDateChange = (date) => {
    history.push(`/battles?t=${date.getTime()}`);
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => {
          handleDateChange(dateFns.addDays(date, -1));
        }}
      >
        <ArrowLeft />
      </IconButton>
      <DateContainer ref={props.inputRef} onClick={props.onClick}>
        {dateFns.isSameDay(date, new Date()) ? "Today" : props.value}
      </DateContainer>
      <IconButton
        color="inherit"
        onClick={() => {
          handleDateChange(dateFns.addDays(date, 1));
        }}
      >
        <ArrowRight />
      </IconButton>
    </>
  );
};

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <Login />
        <TopBar>
          <BarContent>
            <Route path="/battles" exact>
              <BattleDatePicker />
            </Route>
            <div>
              {user.auth ? (
                <User>
                  <Avatar id={user.userid} name={user.username} />{" "}
                  {user.username}
                </User>
              ) : (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    dispatch(showLogin(true));
                  }}
                >
                  Log in
                </Button>
              )}
            </div>
          </BarContent>
        </TopBar>
        <Router />
        <Navigation />
      </BrowserRouter>
    </div>
  );
}

export default App;
