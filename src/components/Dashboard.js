import React from "react";
import Card from "../components/Card";
import { AppContext } from "../pages/HomePage";
import moment from "moment";
import { cardProps } from "../icons/cardProps";

const Dashboard = () => (
  <div className="card--container">
    <TemperatureCard />
    <AppContext.Consumer>
      {(context) =>
        context.cardData.map((doc) =>
          doc.map((data) => (
            <Card
              title={data.type}
              contentTitle={data.description}
              icon={cardProps[data.type].icon}
              classes={cardProps[data.type].classes}
              values={Object.keys(data.data.values).map((value) => {
                return {
                  content: `${data.data.values[value]}`,
                  description: `${value}`
                };
              })}
              footerContent={{
                title: "Last Updated",
                content: moment(data.data.createdAt).format("LLL")
              }}
              key={data.description}
            />
          ))
        )
      }
    </AppContext.Consumer>
  </div>
);

// Legacy stuff, dont want to touch hardware to fix post data format
const TemperatureCard = () => (
  <AppContext.Consumer>
    {(context) => {
      return context.temperatureData["data"].map((dataset) => (
        <Card
          title={"Comfort"}
          contentTitle={dataset.location}
          icon={"fas fa-bed"}
          classes={"card--red"}
          values={[
            {
              content: `${dataset.values.temp} \xB0C`,
              icon: "fas fa-thermometer-half"
            },
            {
              content: `${dataset.values.humid} %`,
              icon: "fas fa-tint"
            }
          ]}
          footerContent={{
            title: "Last Updated",
            content: moment(dataset.values.createdAt).format("LLL")
          }}
          key={dataset.location}
        />
      ));
    }}
  </AppContext.Consumer>
);

export default Dashboard;
