import { useRef, useLayoutEffect } from "react";
import styled, { css } from "styled-components";

const Container = styled.div`
  ${(props) =>
    !props.disabled &&
    css`
      @media all and (min-width: ${(props) => props.enableAt}) {
        height: 100%;
        overflow-y: auto;
      }
    `}
`;

const scrollStore = {};

export const resetScroll = (id) => delete scrollStore[id];

const ScrollView = ({ children, id, enableAt = 0, disabled }) => {
  const view = useRef(null);

  useLayoutEffect(() => {
    view.current.scrollTop = scrollStore[id] ? scrollStore[id] : 0;
  });
  return (
    <Container
      disabled={disabled}
      enableAt={enableAt}
      ref={view}
      onScroll={() => {
        scrollStore[id] = view.current.scrollTop;
      }}
    >
      {children}
    </Container>
  );
};

export default ScrollView;
