import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, Divider } from "@material-ui/core";
import styled from "styled-components";
import Link from "./Link";
import InfoStrip from "./InfoStrip";

const useStyles = makeStyles({
  root: {},
  media: {
    height: 0,
    paddingTop: "56.25%",
    backgroundColor: "#26262b",
    position: "relative",
  },
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
    fontSize: ".7rem",
    letterSpacing: ".07rem",
    opacity: 0.8,
    fontWeight: 200,
  },
});

const Container = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  position: relative;
`;

const LevelCard = ({ linkUrl, times, infoStrip, imageUrl, head }) => {
  const classes = useStyles();
  return (
    <Container to={linkUrl}>
      <Card className={classes.root}>
        {head}
        <CardMedia className={classes.media} image={imageUrl}>
          {infoStrip && (
            <InfoStrip>
              <span>{infoStrip}</span>
            </InfoStrip>
          )}
        </CardMedia>
        <List disablePadding>
          {times.slice(0, 3).map((t, i) => (
            <React.Fragment key={i}>
              <ListItem>
                <div className={classes.rankCell}>{i + 1}.</div>
                <div className={classes.kuskiCell}>
                  {t.name}{" "}
                  {t.team && (
                    <span className={classes.team}>{`[${t.team}]`}</span>
                  )}
                </div>
                <div>{t.time}</div>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Card>
    </Container>
  );
};

export default LevelCard;
