import { useLayoutEffect, useRef, useEffect, useState } from "react";
import styled from "styled-components";
import "../recplay/amd.js";

const Video = styled.div`
  background: #232323;
  height: 100%;
  width: 100%;
  > canvas {
    width: 100%;
    outline: 0;
    pointer-events: none;
    ${(props) => !props.visible && `display: none;`}
  }
`;

const Player = ({ visible, recUrl, levUrl }) => {
  const container = useRef(null);
  const canvas = useRef(null);
  const [loading, setLoading] = useState(false);

  const resize = () => {
    if (canvas.current && container.current) {
      const bounds = container.current.getBoundingClientRect();
      canvas.current.resize(bounds.width, bounds.height);
    }
  };

  useLayoutEffect(() => {
    if (levUrl) {
      initPlayer(levUrl, recUrl);
    }
    /* eslint-disable-next-line */
  }, [levUrl, recUrl]);

  const initPlayer = (levUrl, recUrl) => {
    setLoading(true);
    if (!canvas.current) {
      window.require(["controller"], (controller) => {
        controller(
          levUrl,
          "https://api.elma.online/recplayer/",
          container.current,
          document
        )(function (cnt) {
          canvas.current = cnt;
          canvas.current.player().setScale(0.8);
          resize();
          recUrl && canvas.current.loadReplay(recUrl);
          setLoading(false);
        });
      });
    } else {
      canvas.current.loadLevel(levUrl, () => {
        canvas.current.loadReplay(recUrl);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (canvas.current) {
      const playing = canvas.current.player().playing();
      if (playing !== visible) {
        canvas.current.player().playPause();
      }
    }
  }, [visible]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  });
  return <Video id="recplay" ref={container} visible={visible && !loading} />;
};

export default Player;
