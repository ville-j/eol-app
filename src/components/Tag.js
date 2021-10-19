import Chip from "@material-ui/core/Chip";

const Tag = ({ children }) => (
  <Chip
    style={{ padding: 0 }}
    label={children}
    variant="outlined"
    color="default"
    size="small"
  />
);

export default Tag;
