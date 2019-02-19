import React, { Component } from "react";
import Graph from "../components/Graph";
import { ParentSize } from "@vx/responsive";

class GraphPage extends Component {
  state = {
    data: undefined
  };

  componentDidMount() {
    fetch("/api/temp/all?limit=-504", {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({ data: json });
      });
  }

  render() {
    return (
      <div className="container">
        {this.state.data ? (
          <div className="app-graph">
            <ParentSize className="graph-container">
              {({ width: w, height: h }) => {
                return (
                  <Graph
                    height={h}
                    width={w}
                    margin={{ top: 30, right: 30, bottom: 40, left: 40 }}
                    data={this.state.data}
                    dataValue={"temp"}
                  />
                );
              }}
            </ParentSize>
            <ParentSize className="graph-container">
              {({ width: w, height: h }) => {
                return (
                  <Graph
                    height={h}
                    width={w}
                    margin={{ top: 30, right: 30, bottom: 40, left: 40 }}
                    data={this.state.data}
                    dataValue={"humid"}
                  />
                );
              }}
            </ParentSize>
          </div>
        ) : (
          <h1>Loading</h1>
        )}
      </div>
    );
  }
}

export default GraphPage;
