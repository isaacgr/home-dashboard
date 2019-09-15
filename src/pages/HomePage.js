import React, { Component } from "react";
import { GooeyMenu } from "../components/NavBar";
import Dashboard from "../components/Dashboard";
const Jaysonic = require("jaysonic/lib/client-ws");
const socket = new Jaysonic.wsclient({
  url: "ws://" + window.location.host + "/ws"
});

const AppContext = React.createContext({});

class HomePage extends Component {
  state = {
    temperatureData: {
      data: []
    },
    cardData: []
  };

  componentDidMount() {
    socket
      .connect()
      .then(() => {
        this.getCardData();
        this.subscribeCardData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getCardData() {
    socket
      .request()
      .send("get.temp", [])
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          temperatureData: {
            data: response.result[0]
          }
        }));
      })
      .catch((error) => {
        console.log(error);
      });
    socket
      .request()
      .send("get.data", [])
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          cardData: response.result[0]
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  subscribeCardData() {
    socket.subscribe("update.temp", (error, result) => {
      if (error) {
        console.log(error);
      } else {
        this.setState((prevState) => ({
          ...prevState,
          temperatureData: {
            data: result.params
          }
        }));
      }
    });
    socket.subscribe("update.data", (error, result) => {
      if (error) {
        console.log(error);
      } else {
        this.setState((prevState) => ({
          ...prevState,
          cardData: result.params
        }));
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
