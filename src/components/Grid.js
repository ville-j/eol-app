import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${(props) => props.gridMinWidth}px, 1fr)
  );
  grid-gap: ${(props) => props.margin}px;
  padding: ${(props) => props.margin}px;

  @media all and (max-width: ${(props) =>
      props.gridMinWidth + 1 + props.margin * 4}px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

export default Grid;
