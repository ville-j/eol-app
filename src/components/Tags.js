import Chip from "@material-ui/core/Chip";
import { useSelector } from "react-redux";

const Tags = ({ onChange, selected = [] }) => {
  const tags = useSelector((state) => state.tags.list);

  console.log(tags);

  return tags
    .filter((t) => !t.hidden)
    .map((t) => (
      <Chip
        style={{ marginRight: 10 }}
        key={t.id}
        clickable
        label={t.name}
        color={selected.find((st) => st === t.id) ? "primary" : "default"}
        size="small"
        onClick={() => {
          onChange &&
            onChange(
              selected.find((st) => st === t.id)
                ? selected.filter((st) => st !== t.id)
                : [...selected, t.id]
            );
        }}
      />
    ));
};

export default Tags;
