import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import createBroweserHistory from "history/createBrowserHistory";

import HomePage from "../pages/HomePage";
import GraphPage from "../pages/GraphPage";

const history = createBroweserHistory();

const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/tempgraph" component={GraphPage} />
    </Switch>
  </Router>
);

export default AppRouter;
