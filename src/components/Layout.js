import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
`;

const Side = styled.div`
  width: 100px;
  background: #181719;
`;

const Main = styled.div`
  flex: 1;
`;

const Layout = ({ side, main }) => {
  return (
    <Container>
      <Side>{side}</Side>
      <Main>{main}</Main>
    </Container>
  );
};

export default Layout;
