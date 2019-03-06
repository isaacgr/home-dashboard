import React from "react";

const Greeting = props => (
  <div>
    <h1>
      Good {props.timeOfDay}, {props.username}.
    </h1>
    {props.message ? <p>{props.message}</p> : ""}
  </div>
);
