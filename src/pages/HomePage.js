import React, { Component } from "react";
import { GooeyMenu } from "../components/NavBar";
import { Loader } from "../components/Loader";
import Card from "../components/Card";
// import Footer from "../components/Footer";
class HomePage extends Component {
  state = {
    temperatureData: {
      data: undefined
    }
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
        console.log(json);

        this.setState({
          temperatureData: {
            data: json["data"]
          }
        });
      });
  }
  render() {
    return (
      <section className="data">
        <GooeyMenu />
        <div className="container">
          {this.state.temperatureData["data"] ? (
            this.state.temperatureData["data"].map(dataset => (
              <Card
                title={"Comfort"}
                contentTitle={dataset.location}
                icon={"fas fa-thermometer-half"}
                values={[
                  `${dataset.values.temp} \xB0C`,
                  `${dataset.values.humid} %`
                ]}
                footerContent={{
                  title: "Updated",
                  content: dataset.values.createdAt
                }}
              />
            ))
          ) : (
            <div className="container">
              <Loader />
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default HomePage;
