import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import styled from "styled-components";

const Container = styled.span`
  font-size: 0.8em;
  opacity: 0.8;
`;

const Timestamp = ({ time = 0 }) => (
  <Container>{formatDistanceToNowStrict(new Date(time * 1000))} ago</Container>
);

export default Timestamp;
