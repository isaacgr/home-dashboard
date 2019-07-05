import React, { Component } from "react";
import { GooeyMenu } from "../components/NavBar";
import Dashboard from "../components/Dashboard";
import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:7070");

const AppContext = React.createContext({});

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      temperatureData: {
        data: []
      },
      cardData: []
    };
  }

  componentDidMount() {
    this.getCardData();
  }

  getCardData() {
    socket.emit("getTemp");
    socket.emit("getData");
    socket.on("tempData", (data) => {
      this.setState({
        temperatureData: {
          data: data["data"]
        }
      });
    });
    socket.on("allData", (data) => {
      this.setState({ cardData: data.result });
    });
    socket.on("error", (error) => console.log(error));
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
