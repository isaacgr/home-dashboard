console.log("JS Running");

import React from "react";
import ReactDOM from "react-dom";
import AppRouter from "./routes/AppRouter";

import "./styles/main.scss";

const jsx = <AppRouter />;

ReactDOM.render(jsx, document.getElementById("root"));
