import React from "react";
import { Group } from "@vx/group";
import { curveBasis } from "@vx/curve";
import { LinePath } from "@vx/shape";
import { Threshold } from "@vx/threshold";
import { scaleTime, scaleLinear, scaleOrdinal } from "@vx/scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { GridRows, GridColumns } from "@vx/grid";
import { LegendOrdinal } from "@vx/legend";

// import { cityTemperature as data } from "@vx/mock-data";
import { timeParse } from "d3-time-format";

const parseDateSeconds = timeParse("%Y-%m-%dT%H:%M:%S");
const parseDateOld = timeParse("%Y-%m-%dT%H:%M");
const lineColors = [
  "#2F4F4F",
  "#2E8B57",
  "#00FFFF",
  "#1E90FF",
  "#FF00FF",
  "#C71585"
];

const Graph = ({ width, height, margin, data }) => {
  const date = d => parseDateSeconds(d.createdAt) || parseDateOld(d.createdAt);
  const temp = d => d["temp"];

  const dates = data.map(dataset => {
    return dataset["values"].map(date);
  });

  const temps = data.map(dataset => {
    return dataset["values"].map(temp);
  });

  const minDate = Math.min(
    ...dates.map(mins => {
      return Math.min(...mins);
    })
  );

  const maxDate = Math.max(
    ...dates.map(maxs => {
      return Math.max(...maxs);
    })
  );

  const minTemp = Math.min(
    ...temps.map(mins => {
      return Math.min(...mins);
    })
  );

  const maxTemp = Math.max(
    ...temps.map(maxs => {
      return Math.max(...maxs);
    })
  );

  // scales
  const xScale = scaleTime({
    domain: [minDate, maxDate]
  });
  const yScale = scaleLinear({
    domain: [minTemp, maxTemp],
    nice: true
  });
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);

  const locations = data.map(dataset => {
    return dataset["location"];
  });

  const color = scaleOrdinal({
    domain: locations,
    range: lineColors
  });

  return (
    <div className="graph">
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#f3f3f3"
          rx={14}
        />
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <GridColumns
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
          <AxisBottom
            top={yMax}
            scale={xScale}
            numTicks={width > 520 ? 10 : 5}
          />
          <AxisLeft scale={yScale} />
          <text x="-70" y="15" transform="rotate(-90)" fontSize={10}>
            Temperature (°C)
          </text>
          <Threshold
            data={data[0]["values"]}
            x={d => xScale(date(d))}
            y0={d => yScale(22.2)}
            y1={d => yScale(temp(d))}
            clipAboveTo={0}
            clipBelowTo={yMax}
            curve={curveBasis}
            belowAreaProps={{
              fill: "red",
              fillOpacity: 0.4
            }}
            aboveAreaProps={{
              fill: "lightskyblue",
              fillOpacity: 0.4
            }}
          />
          {data.map(dataset => {
            return (
              <LinePath
                key={dataset["values"]["createdAt"]}
                data={dataset["values"]}
                curve={curveBasis}
                x={d => xScale(date(d))}
                y={d => yScale(temp(d))}
                stroke={lineColors[locations.indexOf(dataset.location)]}
                strokeWidth={3}
                strokeOpacity={0.8}
              />
            );
          })}
        </Group>
      </svg>
      <div className="graph__legend" style={{ top: margin.top / 2 - 10 }}>
        <LegendOrdinal
          scale={color}
          direction="row"
          labelMargin="0 .5rem 0 0"
        />
      </div>
    </div>
  );
};

export default Graph;
