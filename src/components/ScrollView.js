import { useRef, useLayoutEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { useHistory } from "react-router-dom";

import { useWindowDimensions } from "../utils";

const scrollStore = {};

export const resetScroll = (id) => delete scrollStore[id];

const ScrollView = ({ children, id, enableAt = 0, disabled }) => {
  const history = useHistory();
  const view = useRef(null);
  const [w] = useWindowDimensions();

  useLayoutEffect(() => {
    if (
      view.current?.scrollTop &&
      scrollStore[id] &&
      history.action === "POP"
    ) {
      view.current.scrollTop(scrollStore[id]);
    }
  });

  useLayoutEffect(() => {
    if (view.current?.scrollTop && history.action === "PUSH") {
      view.current.scrollTop(0);
    }
  }, [id, history.action]);

  const d = disabled || w < enableAt;

  return (
    <Scrollbars
      autoHide={true}
      ref={view}
      autoHeight={d}
      style={{ height: d ? "auto" : "100%", width: "100%", maxHeight: 10000 }}
      onScroll={(e) => {
        if (id) scrollStore[id] = e.target.scrollTop;
      }}
      autoHeightMax={100000}
    >
      {children}
    </Scrollbars>
  );
};

export default ScrollView;
