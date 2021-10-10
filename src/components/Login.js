import { useState } from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";

import { auth } from "../reducers/user";
import { showLogin } from "../reducers/ui";

const Container = styled.div`
  padding: 40px;
  width: 500px;
  max-width: 100%;

  > div {
    margin-bottom: 20px;

    :last-child {
      margin-bottom: 0;
    }
  }
`;

const Login = () => {
  const dispatch = useDispatch();
  const loginVisible = useSelector((state) => state.ui.showLogin);
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const setValue = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={loginVisible}>
      <Container>
        <div>Log in</div>
        <div>
          <TextField
            autoComplete="off"
            label="Username"
            fullWidth
            variant="outlined"
            size="small"
            color="primary"
            name="username"
            onChange={setValue}
            value={values.username}
          />
        </div>
        <div>
          <TextField
            autoComplete="off"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            size="small"
            color="primary"
            name="password"
            value={values.password}
            onChange={setValue}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 12 }}
            onClick={() => {
              dispatch(auth(values.username, values.password));
            }}
          >
            Log in
          </Button>
          <Button
            onClick={async () => {
              dispatch(showLogin(false));
            }}
          >
            Cancel
          </Button>
        </div>
      </Container>
    </Dialog>
  );
};

export default Login;
