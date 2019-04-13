import React, { Component } from "react";
import { GooeyMenu } from "../components/NavBar";
import Dashboard from "../components/Dashboard";
import { fetchData } from "../functions/fetchData";

const AppContext = React.createContext({});

class HomePage extends Component {
  state = {
    temperatureData: {
      data: []
    },
    cardData: []
  };
  componentDidMount() {
    fetch("/api/temp/", {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({
          temperatureData: {
            data: json["data"]
          }
        });
      });
    fetchData().then(result => {
      this.setState({ cardData: result });
    });
  }
  render() {
    return (
      <section className="data">
        <GooeyMenu />
        <div className="container">
          <AppContext.Provider value={this.state}>
            <Dashboard />
          </AppContext.Provider>
        </div>
      </section>
    );
  }
}

export { AppContext, HomePage as default };
