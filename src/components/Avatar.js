import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchKuski } from "../reducers/kuskis";

import MUIAvatar from "@material-ui/core/Avatar";
import styled from "styled-components";

const Container = styled(MUIAvatar)`
  img {
    width: 200%;
    height: 200%;
    margin-left: -10%;
    margin-top: 5%;
  }
  margin-right: 0.8em;
`;

const Avatar = ({ id, name }) => {
  const dispatch = useDispatch();
  const kuski = useSelector((state) => state.kuskis[id]);

  useEffect(() => {
    if (!kuski && !name) dispatch(fetchKuski(id));
  }, [id, dispatch, kuski, name]);
  return (
    <Container
      alt={kuski?.Kuski || name}
      src={`https://api.elma.online/dl/shirt/${id}`}
    />
  );
};

export default Avatar;
