import React, { Component } from "react";
import { GooeyMenu } from "../components/NavBar";
import Dashboard from "../components/Dashboard";
const Jaysonic = require("jaysonic/lib/client-ws");
const socket = new Jaysonic.wsclient({ url: "ws://localhost:9999" });

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

  componentWillMount() {
    socket
      .connect()
      .then(() => {
        this.getCardData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getCardData() {
    socket.subscribe("update.temp", (error, result) => {
      this.setState({
        temperatureData: {
          data: result.params
        }
      });
    });
    socket.subscribe("update.data", (error, result) => {
      if (error) {
        console.log(error);
      } else {
        this.setState({ cardData: result.params });
      }
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
