import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { DatePicker } from "@material-ui/pickers";
import { Route } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";

import { fetchBattlesBetween, setDate } from "./reducers/battles";

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
  const date = useSelector((state) => state.battles.date);

  const handleDateChange = (date) => {
    dispatch(setDate(date.getTime()));
  };

  useEffect(() => {
    dispatch(fetchBattlesBetween(date, dateFns.addDays(date, 1)));
  }, [dispatch, date]);

  return (
    <div>
      <DatePicker
        variant="inline"
        value={date}
        onChange={handleDateChange}
        format="E dd.MM.yyyy"
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
  const dispatch = useDispatch();
  const date = useSelector((state) => state.battles.date);

  const handleDateChange = (date) => {
    dispatch(setDate(date.getTime()));
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
