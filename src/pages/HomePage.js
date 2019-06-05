import React, { Component } from "react";
import { GooeyMenu } from "../components/NavBar";
import Dashboard from "../components/Dashboard";
import { fetchData } from "../functions/fetchData";
import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:7070");

const AppContext = React.createContext({});

class HomePage extends Component {
  constructor() {
    super();
    this.getCardData();
    this.state = {
      temperatureData: {
        data: []
      },
      cardData: []
    };
  }

  getCardData() {
    socket.emit("getTemp");
    socket.on("tempData", data => {
      this.setState({
        temperatureData: {
          data: data["data"]
        }
      });
    });
    socket.on("error", error => console.log(error));
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
