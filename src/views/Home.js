import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReplays } from "../reducers/replays";
import { ReplayCardWrapped } from "../components/ReplayCard";
import Grid from "../components/Grid";
import ScrollView from "../components/ScrollView";

const Battles = () => {
  const dispatch = useDispatch();
  const replays = useSelector((state) => state.replays);

  useEffect(() => {
    dispatch(fetchReplays());
  }, [dispatch]);

  return (
    <ScrollView id="replays">
      <Grid margin={12} gridMinWidth={350}>
        {replays.list.map((id) => (
          <ReplayCardWrapped id={id} key={id} />
        ))}
      </Grid>
    </ScrollView>
  );
};

export default Battles;
