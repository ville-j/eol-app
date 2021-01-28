import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import styled from "styled-components";

import Battles from "./views/Battles";
import Home from "./views/Home";
import Replay from "./views/Replay";
import Battle from "./views/Battle";
import ScrollView from "./components/ScrollView";
import Player from "./components/RecPlayer";
import BackButton from "./components/BackButton";
import TopBar from "./components/TopBar";

const PlayerContainer = styled.div`
  position: relative;
  ${(props) => !props.visible && `height: 0;`}
  overflow: hidden;
`;

const Sizer = styled.div`
  padding-top: 56.25%;
`;

const PlayerPositioner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const MainWrapper = styled.div`
  padding-top: 48px;
  margin-top: -48px;
  flex: 1;
  height: 100%;
  ${(props) => props.isReplayView && `width: 60%;`}

  @media all and (max-width: 560px) {
    width: 100%;
  }
`;

const Router = () => {
  const match = useRouteMatch("/r/:id");
  const matchBattle = useRouteMatch("/battles/:id");
  const isReplayView = !!match || !!matchBattle;

  const replay = useSelector((state) => state.replays.map[match?.params.id]);
  const battle = useSelector(
    (state) => state.battles.map[matchBattle?.params.id]
  );

  const { recUrl, levUrl } = useSelector((state) => state.player);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [isReplayView]);

  return (
    <>
      <Route exact path="/r/:id">
        <TopBar>
          <BackButton />
          {replay?.RecFileName}
        </TopBar>
      </Route>
      <Route exact path="/battles/:id">
        <TopBar>
          <BackButton />
          {battle?.duration}m battle in {battle?.level.filename}.lev
        </TopBar>
      </Route>
      <MainWrapper isReplayView={isReplayView}>
        <ScrollView disabled={!isReplayView}>
          <PlayerContainer visible={isReplayView}>
            <div style={{ position: "relative" }}>
              <PlayerPositioner>
                <Player
                  visible={isReplayView}
                  recUrl={recUrl}
                  levUrl={levUrl}
                />
              </PlayerPositioner>
              <Sizer />
            </div>
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
        </Switch>
      </MainWrapper>
    </>
  );
};

export default Router;
