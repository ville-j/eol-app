import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import VisibilitySensor from 'react-visibility-sensor';
import Link from "./Link";
import Avatar from "./Avatar";
import InfoStrip from "./InfoStrip";
import Timestamp from "./Timestamp";

const useStyles = makeStyles({
  card: {
    height: "100%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%",
    backgroundColor: "#26262b",
    position: "relative",
  },
});

const Container = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const ReplayInfo = styled.div`
  display: flex;
  margin: 0.8rem;
`;

const ReplayText = styled.div`
  overflow: hidden;
  > div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const ReplayCard = ({
  title,
  uploader,
  uploaderId,
  filename,
  id,
  timestamp,
  infoStrip,
  levelId,
}) => {
  const classes = useStyles();
  const [showImage, setShowImage] = useState(false);

  return (
    <Container to={`/r/${id}`}>
      <Card className={classes.card}>
        <VisibilitySensor partialVisibility={true} onChange={(visible) => {
          visible && setShowImage(true)
        }}>
          <CardMedia
            className={classes.media}
            image={showImage ? `http://janka.la:8765/image?l=${levelId}&r=${id}&n=${filename}` : ''}
            title="Paella dish"
          >
            <InfoStrip>
              <span>{infoStrip}</span>
            </InfoStrip>
          </CardMedia>
        </VisibilitySensor>
        <ReplayInfo>
          <div>
            <Avatar id={uploaderId} name={uploader} />{" "}
          </div>
          <ReplayText>
            <div>
              <b>{uploader}</b> <Timestamp time={timestamp} />
            </div>
            {title && <div>{title}</div>}
            <div>{filename}</div>
          </ReplayText>
        </ReplayInfo>
      </Card>
    </Container>
  );
};

export default ReplayCard;
