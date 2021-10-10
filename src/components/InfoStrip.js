import styled from "styled-components";
import { useTheme } from "@material-ui/core/styles";

const Container = styled.span`
  position: absolute;
  bottom: 0.4rem;
  left: 0.4rem;
  background: #181918;
  color: ${(props) => props.theme.palette.primary.contrastText};
  font-size: 0.8rem;
  > span {
    display: inline-block;
    padding: 0.2rem 0.4rem;
  }
`;

const InfoStrip = ({ children }) => {
  const theme = useTheme();
  return <Container theme={theme}>{children}</Container>;
};

export default InfoStrip;
