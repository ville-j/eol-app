import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import store from "./store";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#0f9878",
    },
    secondary: {
      main: "#1fb8d6",
    },
    surface: {
      light: "#f1f1f1",
      dark: "#212121",
    },
    line: {
      light: "#dcdcdc",
      dark: "#595959",
    },
  },
});

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
};

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
