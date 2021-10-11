import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";

const BackButton = () => {
  const history = useHistory();

  return (
    <IconButton
      color="inherit"
      onClick={() => {
        if (history.location.state?.internal) {
          history.goBack();
        } else {
          history.push("/");
        }
      }}
      aria-label="back"
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackButton;
