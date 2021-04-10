import React, { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, Divider } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

import { fetchBattle, fetchBattleRuns } from "../reducers/battles";
import Kuski from "../components/Kuski";
import { loadRec } from "../reducers/player";

const useStyles = makeStyles({
  root: {},
  rankCell: {
    width: 50,
  },
  kuskiCell: {
    width: "50%",
    maxWidth: 250,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  team: {
    fontSize: ".8rem",
    opacity: 0.8,
    fontWeight: 400,
  },
  timeCell: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: 100,
  },
  results: {
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    flex: "0 0 48px",
    height: "48px",
  },
  prePosition: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "flex",
    color: "#888888",
    fontSize: ".7rem",
    alignItems: "center",
  },
});

const Battle = () => {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch("/battles/:id");
  const battle = useSelector((state) => state.battles.map[match.params.id]);
  const runs = useSelector((state) => state.battles.runs[match.params.id]);

  useEffect(() => {
    if (!battle) dispatch(fetchBattle(match.params.id));
    if (battle) {
      dispatch(
        loadRec({
          recUrl: battle.replay.filename
            ? `https://api.elma.online/dl/battlereplay/${match.params.id}`
            : null,
          levUrl: battle.started
            ? `https://api.elma.online/dl/level/${battle.level.id}`
            : null,
        })
      );
    }
  }, [dispatch, match.params.id, battle]);

  useEffect(() => {
    let inter;

    if (battle && battle.end > new Date()) {
      dispatch(fetchBattleRuns(battle.id, battle.type));

      inter = setInterval(() => {
        if (battle.end > new Date()) {
          dispatch(fetchBattleRuns(battle.id, battle.type));
        } else {
          dispatch(fetchBattle(battle.id));
          clearInterval(inter);
        }
      }, 15000);
    }

    return () => {
      clearInterval(inter);
    };
  }, [dispatch, battle]);

  return (
    <>
      <Side theme={theme}>
        <div className={classes.results}>
          Results {battle?.running ? "live" : ""}
        </div>
        <Divider />

        <List disablePadding>
          {battle?.results.map((t, i) => (
            <React.Fragment key={i}>
              <ListItem>
                <div className={classes.rankCell}>{i + 1}.</div>
                <div className={classes.kuskiCell}>
                  {t.name}{" "}
                  {t.team && (
                    <span className={classes.team}>{`[${t.team}]`}</span>
                  )}
                </div>
                <div className={classes.timeCell}>{t.time}</div>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          {battle &&
            battle.results.length < 1 &&
            runs &&
            runs[runs.length - 1].runs.map((t, i) => (
              <React.Fragment key={i}>
                <ListItem>
                  <div className={classes.rankCell}>{i + 1}.</div>
                  <div className={classes.kuskiCell}>
                    <Kuski
                      id={t.kuskiIndex}
                      renderer={(kuski, team) => {
                        return (
                          <>
                            {kuski}{" "}
                            {team && (
                              <span
                                className={classes.team}
                              >{`[${team}]`}</span>
                            )}
                          </>
                        );
                      }}
                    />
                  </div>
                  <div className={classes.timeCell}>{t.time}</div>
                  <div className={classes.prePosition}>
                    {t.prev === -1 || t.prev === i ? (
                      ""
                    ) : t.prev - i < 0 ? (
                      <>
                        <RankDown /> {Math.abs(t.prev - i)}
                      </>
                    ) : (
                      <>
                        <RankUp /> {Math.abs(t.prev - i)}
                      </>
                    )}
                  </div>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
        </List>
      </Side>
    </>
  );
};

const Side = styled.div`
  @media all and (min-width: 1000px) {
    position: fixed;
    right: 0;
    top: 0;
    width: 40%;
    height: 100%;
    background: ${(props) =>
      props.theme.palette.surface[props.theme.palette.type]};
    padding-bottom: 57px;
    z-index: 11;
    display: flex;
    flex-direction: column;

    > div:last-child {
      flex: 1;
    }
  }
`;

const RankDown = styled(KeyboardArrowDownIcon)`
  color: #bf0000;
  font-size: 1rem;
`;

const RankUp = styled(KeyboardArrowUpIcon)`
  color: #06cc06;
  font-size: 1rem;
`;

export default Battle;
