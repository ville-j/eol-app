import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import { useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { upload } from "../reducers/replays";
import Tags from "../components/Tags";
import ScrollView from "../components/ScrollView";
import { ReplayCardWrapped } from "../components/ReplayCard";

const Container = styled.div`
  min-height: 100%;
  display: flex;
  color: #c0c0c0;
  cursor: default;

  @media all and (max-width: 999px) {
    flex-direction: column;
  }
`;

const UploadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c0c0c0;
  cursor: default;
  flex: 1;

  @media all and (max-width: 999px) {
    width: 100%;
    min-height: 100px;
  }
`;

const Information = styled.div`
  flex: 0 0 40%;
  background: ${(props) =>
    props.theme.palette.surface[props.theme.palette.type]};

  > div {
    margin: 16px;
  }

  color: #fff;

  @media all and (max-width: 999px) {
    flex: unset;
    width: 100%;
    height: initial;
  }
`;

const defaultValues = {
  drivenBy: "",
  description: "",
  filename: "n/a",
  unlisted: false,
  tags: [],
  binary: null,
  drivenById: null,
  uuid: null,
};

let cancelToken;

const Upload = () => {
  const theme = useTheme();
  const [showPanel, setShowPanel] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(defaultValues);

  const setValue = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleDrop = (files) => {
    files.forEach((f) => {
      setValues({ ...defaultValues, filename: f.path, binary: f });
      setShowUpload(false);
      setShowPanel(true);
    });
  };

  return (
    <ScrollView id="upload">
      <Container>
        <Dropzone onDrop={handleDrop} disabled={loading}>
          {({ getRootProps, getInputProps }) => (
            <UploadContainer {...getRootProps()}>
              <input {...getInputProps()} accept=".rec" />
              {loading ? "Uploading..." : "Drop a rec or click to browse recs"}
            </UploadContainer>
          )}
        </Dropzone>
        {showPanel && (
          <Information theme={theme}>
            {!showUpload && (
              <>
                <div>{values.filename}</div>
                <Divider />
                <div>
                  <TextField
                    disabled={loading}
                    autoComplete="off"
                    label="Driven by"
                    fullWidth
                    variant="outlined"
                    size="small"
                    color="primary"
                    name="drivenBy"
                    onChange={async (e) => {
                      setValue(e);
                      const value = e.target.value;
                      try {
                        if (cancelToken) cancelToken.cancel();
                        cancelToken = axios.CancelToken.source();
                        const response = await axios.get(
                          `https://api.elma.online/api/player/Kuski/${value}`,
                          {
                            cancelToken: cancelToken.token,
                          }
                        );
                        if (response.data) {
                          setValues({
                            ...values,
                            drivenBy: value,
                            drivenById: response.data.KuskiIndex,
                          });
                        } else {
                          setValues({
                            ...values,
                            drivenBy: value,
                            drivenById: null,
                          });
                        }
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    value={values.drivenBy}
                  />
                  <div
                    style={{
                      visibility: values.drivenById ? "visible" : "hidden",
                      margin: "5px 14px",
                      opacity: 0.7,
                    }}
                  >
                    Valid kuski
                  </div>
                </div>
                <div>
                  <TextField
                    disabled={loading}
                    autoComplete="off"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    size="small"
                    color="primary"
                    name="description"
                    onChange={setValue}
                    value={values.description}
                    multiline
                    rows={2}
                    rowsMax={10}
                  />
                </div>
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={loading}
                        size="small"
                        checked={values.unlisted}
                        onChange={(e) => {
                          setValues({ ...values, unlisted: e.target.checked });
                        }}
                        name="unlisted"
                        color="primary"
                      />
                    }
                    label="Unlisted"
                  />
                </div>
                <Divider />
                <div>
                  <div>Tags</div>
                  <br />
                  <Tags
                    disabled={loading}
                    selected={values.tags}
                    onChange={(selected) => {
                      setValues({ ...values, tags: selected });
                    }}
                  />
                </div>
                <Divider />
                <div>
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      setLoading(true);
                      const response = await upload(
                        values.binary,
                        values.filename,
                        values.drivenBy,
                        values.drivenById,
                        values.description,
                        values.tags,
                        values.unlisted
                      );

                      if (response) {
                        setValues({ ...defaultValues, uuid: response.UUID });
                        setShowUpload(true);
                      }
                      setLoading(false);
                    }}
                    disabled={
                      !values.binary || values.drivenBy.length < 1 || loading
                    }
                    size="small"
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </>
            )}
            {showUpload && (
              <>
                <div>Replay uploaded</div>
                <Divider />
                <div>
                  <ReplayCardWrapped id={values.uuid} />
                </div>
              </>
            )}
          </Information>
        )}
      </Container>
    </ScrollView>
  );
};

export default Upload;
