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

  componentDidMount() {
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
    socket
      .request()
      .send("get.temp", [])
      .then((data) => {
        this.setState({
          temperatureData: {
            data: data["data"]
          }
        });
      });
    socket
      .request()
      .send("get.data", [])
      .then((data) => {
        this.setState({ cardData: data.result });
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
