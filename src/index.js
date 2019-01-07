console.log("JS Running");

import React from "react";
import ReactDOM from "react-dom";
import Graph from "./Graph.js";
import { ParentSize } from "@vx/responsive";

const json = async () => {
  const response = await fetch("/api/temp/all?limit=-504", {
    headers: {
      "Content-Type": "application/json"
    }
  });
  const json = await response.json();
  return json;
};

const data = json().then(data => {
  ReactDOM.render(
    <div className="app-graph">
      <ParentSize className="graph-container">
        {({ width: w, height: h }) => {
          return (
            <Graph
              height={h}
              width={w}
              margin={{ top: 30, right: 30, bottom: 40, left: 40 }}
              data={data}
            />
          );
        }}
      </ParentSize>
    </div>,
    document.getElementById("root")
  );
});
