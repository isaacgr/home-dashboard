import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import Auth from "../functions/AuthService";

const PrivateRoute = ({ component: Component, ...rest }) => {
  // const [loggedIn, setLoggedIn] = useState(false);
  // const [answer, setAnswer] = useState(false);

  // useEffect(() => {
  //   let isSubscribed = true;
  //   Auth.loggedIn()
  //     .then(isValid => {
  //       return isValid;
  //     })
  //     .then(res => {
  //       if (isSubscribed) {
  //         setLoggedIn(res);
  //         setAnswer(true);
  //       }
  //     });
  //   return () => (isSubscribed = false);
  // });
  return (
    <Route
      {...rest}
      component={() => (Auth.loggedIn() ? <Component /> : <Redirect to="/" />)}
    />
  );
};

export default PrivateRoute;
