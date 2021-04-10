import { useLayoutEffect, useRef, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import Fullscreen from "@material-ui/icons/Fullscreen";
import FullscreenExit from "@material-ui/icons/FullscreenExit";
import ZoomIn from "@material-ui/icons/ZoomIn";
import ZoomOut from "@material-ui/icons/ZoomOut";
import { useLocalStorage } from "react-use";
import "../recplay/amd.js";

const Video = styled.div`
  background: #232323;
  height: 100%;
  width: 100%;
  > canvas {
    width: 100%;
    outline: 0;
    ${(props) => !props.visible && `display: none;`}
  }
`;

const Player = ({ visible, recUrl, levUrl }) => {
  const container = useRef(null);
  const canvas = useRef(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [scale, setScale] = useLocalStorage("scale", 1);

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
          resize();
          recUrl && canvas.current.loadReplay(recUrl);
          setLoading(false);
          canvas.current.player().setScale(scale);
        });
      });
    } else {
      canvas.current.loadLevel(levUrl, () => {
        recUrl && canvas.current.loadReplay(recUrl);
        setLoading(false);
        canvas.current.player().setScale(scale);
      });
    }
  };

  useEffect(() => {
    if (canvas.current) {
      const playing = canvas.current.player().playing();
      if (playing !== visible) {
        canvas.current.player().playPause();
        setPlaying((prev) => !prev);
      }
      if (!visible) {
        setFullscreen(false);
      }
    }
  }, [visible]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  const playPause = () => {
    canvas.current.player().playPause();
    setPlaying(canvas.current.player().playing());
  };

  useLayoutEffect(() => {
    resize();
  }, [fullscreen]);

  const controls = (
    <Controls fullscreen={fullscreen}>
      <LeftControls>
        <IconButton onClick={playPause}>
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton
          onClick={() => {
            const s = canvas.current.player().scale() * 1.2;
            canvas.current.player().setScale(s);
            setScale(s);
          }}
        >
          <ZoomIn />
        </IconButton>
        <IconButton
          onClick={() => {
            const s = canvas.current.player().scale() / 1.2;
            canvas.current.player().setScale(s);
            setScale(s);
          }}
        >
          <ZoomOut />
        </IconButton>
      </LeftControls>
      <IconButton
        onClick={() => {
          setFullscreen((prev) => !prev);
        }}
      >
        {fullscreen ? <FullscreenExit /> : <Fullscreen />}
      </IconButton>
    </Controls>
  );

  return (
    <Container>
      <div style={{ position: "relative" }}>
        <PlayerPositioner fullscreen={fullscreen}>
          <Video id="recplay" ref={container} visible={visible && !loading} />
          {fullscreen && controls}
        </PlayerPositioner>
        <Sizer />
      </div>
      {!fullscreen && controls}
    </Container>
  );
};

const Container = styled.div``;

const Sizer = styled.div`
  padding-top: 56.25%;
`;

const PlayerPositioner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  ${(props) =>
    props.fullscreen &&
    css`
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
    `};
`;

const Controls = styled.div`
  display: flex;
  background: #171717;
  position: relative;
  ${(props) =>
    props.fullscreen &&
    css`
      margin-top: -48px;
    `}
`;

const LeftControls = styled.div`
  flex: 1;
`;

export default Player;
