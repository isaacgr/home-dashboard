import React, { Component } from "react";

class HomePage extends Component {
  state = {
    data: undefined
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
        this.setState({ data: json["data"] });
      });
  }
  render() {
    return (
      <section className="data">
        <div className="container">
          {this.state.data ? (
            this.state.data.map(dataset => (
              <div className="dataset">
                <div className="heading">
                  <h1 className="data__header data__header--location">
                    {dataset.location}
                  </h1>
                  <p className="data__value--alt u-text-sm">
                    {dataset.values.createdAt}
                  </p>
                </div>
                <div className="data__block">
                  <h1 className="data__header">Temperature</h1>
                  <p className="data__value">{dataset.values.temp} &#176; C</p>
                  {dataset.values.temp_f ? (
                    <p className="data__value--alt">
                      {dataset.values.temp_f} &#176; F
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="data__block">
                  <h1 className="data__header">Humidity</h1>
                  <p className="data__value">{dataset.values.humid}%</p>
                </div>
              </div>
            ))
          ) : (
            <h1 className="has-text-primary">Loading</h1>
          )}
        </div>
      </section>
    );
  }
}

export default HomePage;
