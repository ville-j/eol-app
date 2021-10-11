import RecPlayer from "recplayer-react";

const Player = ({ recUrl, levUrl, visible }) =>
  visible ? (
    <RecPlayer
      recUrl={recUrl}
      levUrl={levUrl}
      width="auto"
      height="auto"
      zoom={0.8}
      controls
      autoPlay
      imageUrl="https://elma.online/recplayer/"
    />
  ) : null;

export default Player;
