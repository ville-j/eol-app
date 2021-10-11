import Chip from "@material-ui/core/Chip";
import { useSelector } from "react-redux";

const Tags = ({ onChange, selected = [], disabled }) => {
  const tags = useSelector((state) => state.tags.list);

  return tags
    .filter((t) => !t.hidden)
    .map((t) => (
      <Chip
        style={{ marginRight: 10, marginBottom: 10 }}
        key={t.id}
        clickable={!disabled}
        label={t.name}
        color={selected.find((st) => st.id === t.id) ? "primary" : "default"}
        size="small"
        onClick={() => {
          !disabled &&
            onChange &&
            onChange(
              selected.find((st) => st.id === t.id)
                ? selected.filter((st) => st.id !== t.id)
                : [...selected, t]
            );
        }}
      />
    ));
};

export default Tags;
