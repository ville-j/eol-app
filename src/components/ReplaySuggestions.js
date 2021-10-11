import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReplayCardWrapped } from "../components/ReplayCard";
import SideScroller from "../components/SideScroller";
import { fetchLevelReplays } from "../reducers/replays";

const ReplaySuggestions = ({ levId, excludeUUID }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    levId && dispatch(fetchLevelReplays(levId));
  }, [dispatch, levId]);

  const suggestions = useSelector(
    (state) => state.replays.byLevel[levId] || []
  ).filter((id) => id !== excludeUUID);

  if (suggestions.length < 1) return null;

  return (
    <SideScroller title="Suggested">
      {suggestions.map((id) => (
        <ReplayCardWrapped id={id} key={id} />
      ))}
    </SideScroller>
  );
};

export default ReplaySuggestions;
