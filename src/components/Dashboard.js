import React from "react";
import { Loader } from "../components/Loader";
import Card from "../components/Card";
import { AppContext } from "../pages/HomePage";
import moment from "moment";

const Dashboard = () => (
  <>
    <TemperatureCard />
    <AppContext.Consumer>
      {context =>
        context.cardData.map(doc =>
          doc.map(data => (
            <Card
              title={data.type}
              contentTitle={data.description}
              icon={"fas fa-bed"}
              values={[]}
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
  </>
);

// Legacy stuff, dont want to touch hardware to fix post data format
const TemperatureCard = () => (
  <AppContext.Consumer>
    {context => {
      return context.temperatureData["data"].map(dataset => (
        <Card
          title={"Comfort"}
          contentTitle={dataset.location}
          icon={"fas fa-bed"}
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
