import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectBattles } from "../reducers/battles";
import LevelCard from "../components/LevelCard";
import Grid from "../components/Grid";
import ScrollView from "../components/ScrollView";
import BattleType from "../components/BattleType";
import { dateFns } from "../utils";
import { useTheme } from "@material-ui/core/styles";
import { useEffect, useState } from "react";

const Battles = () => {
  const battles = useSelector(selectBattles);
  const theme = useTheme();
  return (
    <ScrollView id="battles">
      <Grid margin={12} gridMinWidth={350}>
        {battles.map((b) => {
          const running = !!b.started && !b.finished && !b.aborted;

          return (
            <LevelCard
              imageUrl="https://janka.la:2828/levels/3134/map"
              linkUrl={`battles/${b.id}`}
              key={b.id}
              times={b.results}
              head={
                <>
                  <Head theme={theme}>
                    <Type>
                      {b.duration}m <BattleType type={b.type} /> &middot;{" "}
                      {b.designer.name}
                    </Type>
                    <DateTime>
                      {running && <Countdown end={b.end} />}{" "}
                      {b.queued
                        ? "in queue"
                        : dateFns.format(b.started, "HH:mm")}
                    </DateTime>
                  </Head>
                  {running && (
                    <Timeline start={b.started} end={b.end} theme={theme} />
                  )}
                </>
              }
            />
          );
        })}
      </Grid>
    </ScrollView>
  );
};

const Head = styled.div`
  font-size: 0.8rem;
  padding: 12px;
  background: ${(props) =>
    props.theme.palette.surface[props.theme.palette.type]};
  display: flex;
  align-items: center;
  font-weight: 300;
`;

const Type = styled.div`
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DateTime = styled.div`
  float: right;
`;

const Timeline = ({ start, end, theme }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let interval;

    const count = () => {
      const d = new Date();
      d.setMilliseconds(0);
      if (d > end) clearInterval(interval);
      setWidth(((d - start) / (end - start)) * 100);
    };

    interval = setInterval(count, 1000);
    count();

    return () => {
      clearInterval(interval);
    };
  }, [end, start]);

  return (
    <TimelineBackground theme={theme}>
      <TimelineTime style={{ width: `${width}%` }} />
    </TimelineBackground>
  );
};

const Countdown = ({ end }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;

    const count = () => {
      const d = new Date();
      d.setMilliseconds(0);
      if (d > end) clearInterval(interval);
      setTime((end - d) / 1000);
    };

    interval = setInterval(count, 1000);
    count();

    return () => {
      clearInterval(interval);
    };
  }, [end]);
  if (time < 0) return null;
  return `${Math.floor(time / 60)}:${(time % 60)
    .toString()
    .padStart(2, "0")} · `;
};

const TimelineBackground = styled.div`
  background: #fff;
  position: absolute;
  width: 100%;
  z-index: 10;
  height: 5px;
  overflow: hidden;
`;

const TimelineTime = styled.div`
  height: 100%;
  background: #6434c1;
  text-align: right;
  position: relative;
`;

export default Battles;
