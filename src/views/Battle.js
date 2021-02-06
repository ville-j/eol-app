import React, { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, Divider } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import { fetchBattle } from "../reducers/battles";
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
  },
  results: {
    height: 48,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
  },
});

const Battle = () => {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch("/battles/:id");
  const battle = useSelector((state) => state.battles.map[match.params.id]);

  useEffect(() => {
    dispatch(fetchBattle(match.params.id));
    if (battle) {
      dispatch(
        loadRec({
          recUrl: `https://api.elma.online/dl/battlereplay/${match.params.id}`,
          levUrl: `https://api.elma.online/dl/level/${battle.level.id}`,
        })
      );
    }
  }, [dispatch, match.params.id, battle]);

  return (
    <>
      <Side theme={theme}>
        <div className={classes.results}>Battle results</div>
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
        </List>
      </Side>
    </>
  );
};

const Side = styled.div`
  @media all and (min-width: 561px) {
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

export default Battle;
