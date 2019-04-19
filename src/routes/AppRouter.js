import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";

import HomePage from "../pages/HomePage";
import GraphPage from "../pages/GraphPage";
import CameraPage from "../pages/CameraPage";
import Login from "../components/Login";

const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={() => <Login history={history} />} />
      <Route path="/home" component={HomePage} />
      <Route path="/tempgraph" component={GraphPage} />
      <Route path="/camera" component={CameraPage} />
    </Switch>
  </Router>
);

export default AppRouter;
