import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthService from "./AuthService";

const PrivateRoute = ({ component: Component, ...rest }) => {
  let Auth = new AuthService();
  return (
    <Route
      {...rest}
      component={() => (Auth.loggedIn() ? <Component /> : <Redirect to="/" />)}
    />
  );
};

export default PrivateRoute;
