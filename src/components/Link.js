import { Link as RouterLink, useHistory } from "react-router-dom";

const Link = (props) => {
  const history = useHistory();
  return (
    <RouterLink
      {...props}
      onClick={(e) => {
        e.preventDefault();
        if (history.location.pathname !== props.to) {
          history.push(props.to, { internal: true });
        }
      }}
    />
  );
};

export default Link;
