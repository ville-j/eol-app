import { useRef, useLayoutEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { useWindowDimensions } from "../utils";

const scrollStore = {};

export const resetScroll = (id) => delete scrollStore[id];

const ScrollView = ({ children, id, enableAt = 0, disabled }) => {
  const view = useRef(null);
  const [w] = useWindowDimensions();

  useLayoutEffect(() => {
    if (view.current?.scrollTop) {
      view.current.scrollTop(scrollStore[id] ? scrollStore[id] : 0);
    }
  });

  const d = disabled || w < enableAt;

  return (
    <Scrollbars
      autoHide={true}
      ref={view}
      autoHeight={d}
      style={{ height: d ? "auto" : "100%", width: "100%" }}
      onScroll={(e) => {
        scrollStore[id] = e.target.scrollTop;
      }}
    >
      {children}
    </Scrollbars>
  );
};

export default ScrollView;
