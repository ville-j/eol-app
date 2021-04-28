import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import styled from "styled-components";

import Battles from "./views/Battles";
import Home from "./views/Home";
import Replay from "./views/Replay";
import Battle from "./views/Battle";
import Upload from "./views/Upload";
import ScrollView from "./components/ScrollView";
import Player from "./components/Player";
import BackButton from "./components/BackButton";
import TopBar from "./components/TopBar";
import BattleType from "./components/BattleType";
import { formatTime } from "./utils";

const PlayerContainer = styled.div`
  position: relative;
  ${(props) => !props.visible && `height: 0;`}
  overflow: hidden;
`;

const MainWrapper = styled.div`
  padding-top: 48px;
  margin-top: -48px;
  flex: 1;
  height: 100%;
  ${(props) => props.isReplayView && `width: 60%;`}

  @media all and (max-width: 999px) {
    width: 100%;
  }
`;

const Dash = styled.span`
  opacity: 0.8;
  display: inline-block;
  margin: 0 5px;
`;

const Router = () => {
  const match = useRouteMatch("/r/:id");
  const matchBattle = useRouteMatch("/battles/:id");

  const replay = useSelector((state) => state.replays.map[match?.params.id]);
  const battle = useSelector(
    (state) => state.battles.map[matchBattle?.params.id]
  );

  const { recUrl, levUrl } = useSelector((state) => state.player);

  const isReplayView = !!match || (!!matchBattle && battle?.started);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [isReplayView]);

  return (
    <>
      <Route exact path="/r/:id">
        <TopBar>
          <BackButton />
          <span>{replay?.RecFileName}</span>
          <Dash>/</Dash>
          <span>{formatTime(replay?.ReplayTime, 0, null, true, false)}</span>
        </TopBar>
      </Route>
      <Route exact path="/battles/:id">
        <TopBar>
          <BackButton />
          {battle?.duration}m <BattleType type={battle?.type} /> battle in{" "}
          {battle?.level.filename}.lev by {battle?.designer.name}
        </TopBar>
      </Route>
      <MainWrapper isReplayView={isReplayView}>
        <ScrollView disabled={!isReplayView}>
          <PlayerContainer visible={isReplayView}>
            <Player visible={isReplayView} recUrl={recUrl} levUrl={levUrl} />
          </PlayerContainer>
          <Route exact path="/r/:id">
            <Replay />
          </Route>
          <Route exact path="/battles/:id">
            <Battle />
          </Route>
        </ScrollView>
        <Switch>
          <Route exact path="/battles">
            <Battles />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/upload">
            <Upload />
          </Route>
        </Switch>
      </MainWrapper>
    </>
  );
};

export default Router;
