import { useState } from "react";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import { useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import Tags from "../components/Tags";

const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c0c0c0;
  cursor: default;
`;

const UploadContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c0c0c0;
  cursor: default;
  flex: 1;
`;

const Information = styled.div`
  height: 100%;
  flex: 0 0 40%;
  background: red;
  background: ${(props) =>
    props.theme.palette.surface[props.theme.palette.type]};

  > div {
    margin: 16px;
  }

  color: #fff;
`;

const defaultValues = {
  drivenBy: "",
  description: "",
  filename: "n/a",
  unlisted: false,
  tags: [],
  binary: null,
};

const Upload = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showPanel, setShowPanel] = useState(false);

  const [values, setValues] = useState(defaultValues);

  const setValue = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const tags = useSelector((state) => state.tags.list);

  const handleDrop = (files) => {
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binary = reader.result;
        setValues({ ...defaultValues, filename: f.path, binary });
        setShowPanel(true);
      };
      reader.readAsArrayBuffer(f);
    });
  };

  return (
    <Container>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <UploadContainer {...getRootProps()}>
            <input {...getInputProps()} accept=".rec" />
            Drop .rec or click to browse recs
          </UploadContainer>
        )}
      </Dropzone>
      {showPanel && (
        <Information theme={theme}>
          <div>{values.filename}</div>
          <Divider />
          <div>
            <TextField
              autoComplete="off"
              label="Driven by"
              fullWidth
              variant="outlined"
              size="small"
              color="primary"
              name="drivenBy"
              onChange={setValue}
              value={values.drivenBy}
            />
          </div>
          <div>
            <TextField
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
              onClick={() => {
                setValues({ ...defaultValues });
                //setShowPanel(false);
              }}
              disabled={!values.binary || values.drivenBy.length < 1}
              size="small"
            >
              Upload
            </Button>
          </div>
        </Information>
      )}
    </Container>
  );
};

export default Upload;
