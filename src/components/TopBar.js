import styled from "styled-components";
import { useTheme } from "@material-ui/core/styles";

const Container = styled.div`
  background: ${(props) => props.theme.palette.topBar};
  color: ${(props) => props.theme.palette.primary.contrastText};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  height: 48px;
  display: flex;
  align-items: center;
`;

const TopBar = ({ children }) => {
  const theme = useTheme();
  return <Container theme={theme}>{children}</Container>;
};

export default TopBar;
