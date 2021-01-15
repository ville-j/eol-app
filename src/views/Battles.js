import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBattles, selectBattles } from "../reducers/battles";
import LevelCard from "../components/LevelCard";
import Grid from "../components/Grid";
import ScrollView from "../components/ScrollView";

const Battles = () => {
  const dispatch = useDispatch();
  const battles = useSelector(selectBattles);

  useEffect(() => {
    dispatch(fetchBattles());
  }, [dispatch]);

  return (
    <ScrollView id="battles">
      <Grid margin={12} gridMinWidth={350}>
        {battles.map((b) => {
          return (
            <LevelCard
              imageUrl="https://janka.la:2828/levels/3134/map"
              linkUrl={`battles/${b.id}`}
              key={b.id}
              infoStrip={`${b.duration}m by ${b.designer.name}`}
              times={b.results}
            />
          );
        })}
      </Grid>
    </ScrollView>
  );
};

export default Battles;
