import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchKuski } from "../reducers/kuskis";

const Kuski = ({ id }) => {
  const dispatch = useDispatch();
  const kuski = useSelector((state) => state.kuskis[id]);

  useEffect(() => {
    dispatch(fetchKuski(id));
  }, [id, dispatch]);

  return kuski ? kuski.name : null;
};

export default Kuski;
