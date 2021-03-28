import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import LiveTvIcon from "@material-ui/icons/LiveTv";
import FlagIcon from "@material-ui/icons/Flag";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { resetDate, getToday } from "../reducers/battles";
import { resetScroll } from "./ScrollView";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid
    ${(props) => props.theme.palette.line[props.theme.palette.type]};
  background: ${(props) => props.theme.palette.background.paper};
  overflow: hidden;
  z-index: 12;
`;

const Navigation = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Container theme={theme}>
      <BottomNavigation showLabels>
        <BottomNavigationAction
          component={NavLink}
          exact
          to="/"
          label="Replays"
          icon={<LiveTvIcon />}
          onClick={() => {
            resetScroll(`replays`);
          }}
        />
        <BottomNavigationAction
          component={NavLink}
          to="/battles"
          label="Battles"
          icon={<FlagIcon />}
          onClick={() => {
            dispatch(resetDate());
            resetScroll(`battles-${getToday()}`);
          }}
        />
      </BottomNavigation>
    </Container>
  );
};

export default Navigation;
