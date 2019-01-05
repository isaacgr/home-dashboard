console.log("JS Running");

import React from "react";
import ReactDOM from "react-dom";
import Graph from "./Graph.js";

const json = async () => {
  const response = await fetch("/api/temp/all?limit=216", {
    headers: {
      "Content-Type": "application/json"
    }
  });
  const json = await response.json();
  return json;
};

const data = json().then(data => {
  ReactDOM.render(
    <Graph
      height={600}
      width={1000}
      margin={{ top: 20, right: 20, bottom: 30, left: 30 }}
      data={data}
    />,
    document.getElementById("root")
  );
});
