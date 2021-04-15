import { useSelector } from "react-redux";
import { ReplayCardWrapped } from "../components/ReplayCard";
import SideScroller from "../components/SideScroller";

const ReplaySuggestions = ({ levId, excludeUUID }) => {
  const suggestions = useSelector(
    (state) => state.replays.byLevel[levId] || []
  ).filter((id) => id !== excludeUUID);

  if (suggestions.length < 1) return null;

  return (
    <SideScroller title="Suggested">
      {suggestions.map((id) => <ReplayCardWrapped id={id} key={id} />)}
    </SideScroller>
  );
};

export default ReplaySuggestions;
