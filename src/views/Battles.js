import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectBattles } from "../reducers/battles";
import LevelCard from "../components/LevelCard";
import Grid from "../components/Grid";
import ScrollView from "../components/ScrollView";
import { dateFns } from "../utils";
import { useTheme } from "@material-ui/core/styles";

const Battles = () => {
  const battles = useSelector(selectBattles);
  const theme = useTheme();
  return (
    <ScrollView id="battles">
      <Grid margin={12} gridMinWidth={350}>
        {battles.map((b) => {
          return (
            <LevelCard
              imageUrl="https://janka.la:2828/levels/3134/map"
              linkUrl={`battles/${b.id}`}
              key={b.id}
              times={b.results}
              head={
                <Head theme={theme}>
                  {`${b.duration}m by ${b.designer.name}`} / {b.level.filename}
                  .lev
                  <DateTime>{dateFns.format(b.started, "HH:mm:ss")}</DateTime>
                </Head>
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
  color: rgba(255, 255, 255, 0.9);
`;

const DateTime = styled.span`
  float: right;
`;

export default Battles;
