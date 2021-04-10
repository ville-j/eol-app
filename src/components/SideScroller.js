import { Scrollbars } from "react-custom-scrollbars";
import styled from "styled-components";

const Container = styled.div`
  height: 280px;
  margin-bottom: 12px;
`;

const Items = styled.div`
  display: flex;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-basis: 300px;
  overflow: hidden;
  flex: 0 0 300px;
  padding: 12px;
  padding-left: 0;

  :first-child {
    margin-left: 12px;
  }

  > * {
    width: 100%;
  }
`;

const Title = styled.div`
  padding: 0 12px;
  margin-top: 12px;
  font-weight: 400;
  font-size: 1em;
  text-transform: uppercase;
  opacity: 0.7;
`;

const SideScroller = ({ title, children }) => {
  return (
    <>
      {title && <Title>{title}</Title>}
      <Container>
        <Scrollbars>
          <Items>
            {children?.map((c, i) => (
              <ItemContainer key={i}>{c}</ItemContainer>
            ))}
          </Items>
        </Scrollbars>
      </Container>
    </>
  );
};

export default SideScroller;
