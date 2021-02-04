import { useEffect } from "react";
import styled from "styled-components";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { useRouteMatch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@material-ui/core/styles";

import {
  fetchReplay,
  fetchReplayComments,
  addComment,
} from "../reducers/replays";
import { loadRec } from "../reducers/player";
import Avatar from "../components/Avatar";
import Kuski from "../components/Kuski";
import Timestamp from "../components/Timestamp";
import ScrollView from "../components/ScrollView";

const Comment = styled.div`
  margin: 0;
  padding: 12px;
  background: ${(props) => props.theme.palette.background.default};
  display: flex;
  border-radius: 2px;
`;

const Comments = styled.div`
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

    ${Comment} {
      margin: 12px;
    }
  }
`;

const ReplayInfo = styled.div`
  display: flex;
  margin: 12px;
`;

const EmptyData = styled.div`
  margin: 12px;
  padding: 12px;
  opacity: 0.4;
  text-transform: uppercase;
  text-align: center;
`;

const InputContainer = styled.div`
  padding: 12px;
`;

const Replay = () => {
  const theme = useTheme();
  const match = useRouteMatch("/r/:id");
  const replay = useSelector((state) => state.replays.map[match.params.id]);
  const comments = useSelector(
    (state) => state.replays.comments[replay?.ReplayIndex]
  );

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReplay(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (replay) dispatch(fetchReplayComments(replay.ReplayIndex));
  }, [dispatch, replay]);

  useEffect(() => {
    if (replay) {
      dispatch(
        loadRec({
          recUrl: `https://eol.ams3.digitaloceanspaces.com/replays/${replay.UUID}/${replay.RecFileName}`,
          levUrl: `https://elma.online/dl/level/${replay.LevelIndex}`,
        })
      );
    }
  }, [dispatch, match.params.id, replay]);

  if (!replay) return null;

  return (
    <>
      <ReplayInfo>
        <div>
          <Avatar id={replay.UploadedBy} name={replay.UploadedByData?.Kuski} />
        </div>
        <div>
          <div>
            <b>
              <Kuski id={replay.UploadedBy} />
            </b>{" "}
            <Timestamp time={replay.Uploaded} />
          </div>
          {replay.Comment && <div>{replay.Comment}</div>}
          <div>{replay.RecFileName}</div>
        </div>
      </ReplayInfo>
      <Divider />
      <Comments theme={theme}>
        {user.auth && (
          <InputContainer>
            <TextField
              size="small"
              multiline
              rows={2}
              rowsMax={10}
              fullWidth
              variant="filled"
              label="Write a comment"
            />
            <Button
              size="small"
              style={{ marginTop: 12 }}
              variant="outlined"
              onClick={() => {
                dispatch(addComment("id", "msg"));
              }}
            >
              Send
            </Button>
          </InputContainer>
        )}
        <div>
          <ScrollView enableAt="651px">
            {comments?.map((c) => (
              <Comment key={c.ReplayCommentIndex} theme={theme}>
                <div>
                  <Avatar id={c.KuskiIndex} name={c.KuskiData.Kuski} />
                </div>
                <div>
                  <div>
                    <b>{c.KuskiData.Kuski}</b> <Timestamp time={c.Entered} />
                  </div>
                  <div>{c.Text}</div>
                </div>
              </Comment>
            ))}
            {comments?.length === 0 && <EmptyData>no comments</EmptyData>}
          </ScrollView>
        </div>
      </Comments>
    </>
  );
};

export default Replay;
