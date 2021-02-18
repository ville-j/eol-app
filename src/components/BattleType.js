const BattleType = ({ type }) => {
  switch (type) {
    case "NM":
      return "normal";
    case "FF":
      return "first finish";
    case "OL":
      return "one life";
    case "SL":
      return "slowness";
    case "SR":
      return "survivor";
    case "FT":
      return "flag tag";
    case "AP":
      return "apple";
    case "SP":
      return "speed";
    case "LC":
      return "last counts";
    case "FC":
      return "finish count";
    case "HT":
      return "1 hour tt";
    default:
      return type || "";
  }
};

export default BattleType;
