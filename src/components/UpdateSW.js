import React, { useEffect, useState } from "react";
import * as serviceWorker from "../serviceWorkerRegistration";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  bottom: 85px;
  left: 24px;
  background: #0f9878;
  padding: 12px;
  color: #fff;
  cursor: pointer;
  z-index: 10000;
`;

let waitingWorker;

const UpdateSW = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  useEffect(() => {
    serviceWorker.register({
      onUpdate: (registration) => {
        waitingWorker = registration.waiting;
        setShowUpdate(true);
      },
    });
  }, []);

  if (!showUpdate) return null;

  return (
    <Container
      onClick={() => {
        if (waitingWorker) waitingWorker.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      }}
    >
      Update available
    </Container>
  );
};

export default UpdateSW;
