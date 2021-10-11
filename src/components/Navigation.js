import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import LiveTvIcon from "@material-ui/icons/LiveTv";
import FlagIcon from "@material-ui/icons/Flag";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { resetDate } from "../reducers/battles";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid
    ${(props) => props.theme.palette.line[props.theme.palette.type]};
  background: ${(props) => props.theme.palette.background.paper};
  overflow: hidden;
  z-index: 12;

  a {
    opacity: 0.6;
  }

  .active {
    opacity: 1;
    color: #fff;
  }
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
        />
        <BottomNavigationAction
          component={NavLink}
          to="/upload"
          label="Upload"
          icon={<AddCircleIcon />}
        />
        <BottomNavigationAction
          component={NavLink}
          to="/battles"
          exact
          label="Battles"
          icon={<FlagIcon />}
          onClick={() => {
            dispatch(resetDate());
          }}
        />
      </BottomNavigation>
    </Container>
  );
};

export default Navigation;
