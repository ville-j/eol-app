import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReplays } from "../reducers/replays";
import ReplayCard from "../components/ReplayCard";
import Grid from "../components/Grid";
import ScrollView from "../components/ScrollView";
import { formatTime } from "../utils";

const Battles = () => {
  const dispatch = useDispatch();
  const replays = useSelector((state) => state.replays);

  useEffect(() => {
    dispatch(fetchReplays());
    /* eslint-disable-next-line */
  }, []);
  return (
    <ScrollView id="replays">
      <Grid margin={12} gridMinWidth={350}>
        {replays.list.map((id) => {
          const r = replays.map[id];
          return (
            <ReplayCard
              key={r.ReplayIndex}
              id={r.UUID}
              title={r.Comment}
              uploader={r.UploadedByData?.Kuski}
              filename={r.RecFileName}
              uploaderId={r.UploadedBy}
              timestamp={r.Uploaded}
              infoStrip={formatTime(r.ReplayTime, 0, null, true).slice(0, -1)}
            />
          );
        })}
      </Grid>
    </ScrollView>
  );
};

export default Battles;
