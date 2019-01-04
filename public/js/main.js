console.log("JS Running");

// var data = [
//   {
//     name: "USA",
//     values: [
//       {date: "2000", price: "100"},
//       {date: "2001", price: "110"},
//       {date: "2002", price: "145"},
//       {date: "2003", price: "241"},
//       {date: "2004", price: "101"},
//       {date: "2005", price: "90"},
//       {date: "2006", price: "10"},
//       {date: "2007", price: "35"},
//       {date: "2008", price: "21"},
//       {date: "2009", price: "201"}
//     ]
//   },
//   {
//     name: "Canada",
//     values: [
//       {date: "2000", price: "200"},
//       {date: "2001", price: "120"},
//       {date: "2002", price: "33"},
//       {date: "2003", price: "21"},
//       {date: "2004", price: "51"},
//       {date: "2005", price: "190"},
//       {date: "2006", price: "120"},
//       {date: "2007", price: "85"},
//       {date: "2008", price: "221"},
//       {date: "2009", price: "101"}
//     ]
//   },
//   {
//     name: "Maxico",
//     values: [
//       {date: "2000", price: "50"},
//       {date: "2001", price: "10"},
//       {date: "2002", price: "5"},
//       {date: "2003", price: "71"},
//       {date: "2004", price: "20"},
//       {date: "2005", price: "9"},
//       {date: "2006", price: "220"},
//       {date: "2007", price: "235"},
//       {date: "2008", price: "61"},
//       {date: "2009", price: "10"}
//     ]
//   }
// ];

var width = 790;
var height = 500;
var margin = 50;
var duration = 250;

var lineOpacity = "0.25";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";

var circleOpacity = "0.85";
var circleOpacityOnLineHover = "0.25";
var circleRadius = 3;
var circleRadiusHover = 6;

/* Format Data */
var parseDate = d3.timeParse("%Y-%m-%dT%H:%M");
const data = getData()
  .then(data => {
    return data;
  })
  .then(data => {
    data.forEach(function(d) {
      d.values.forEach(function(d) {
        d.created = parseDate(d.createdAt);
        d.temp = +d.temp;
      });
    });

    /* Scale */
    var xScale = d3
      .scaleTime()
      .domain(d3.extent(data[0].values, d => d.created))
      .range([0, width - margin]);

    var yScale = d3
      .scaleLinear()
      .domain([10, d3.max(data[0].values, d => d.temp)])
      .range([height - margin, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    /* Add SVG */
    var svg = d3
      .select("#chart")
      .append("svg")
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);

    /* Add line into SVG */
    var line = d3
      .line()
      .x(d => xScale(d.created))
      .y(d => yScale(d.temp));

    let lines = svg.append("g").attr("class", "lines");

    lines
      .selectAll(".line-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "line-group")
      .on("mouseover", function(d, i) {
        svg
          .append("text")
          .attr("class", "title-text")
          .style("fill", color(i))
          .text(d.location)
          .attr("text-anchor", "middle")
          .attr("x", (width - margin) / 2)
          .attr("y", 5);
      })
      .on("mouseout", function(d) {
        svg.select(".title-text").remove();
      })
      .append("path")
      .attr("class", "line")
      .attr("d", d => line(d.values))
      .style("stroke", (d, i) => color(i))
      .style("opacity", lineOpacity)
      .on("mouseover", function(d) {
        d3.selectAll(".line").style("opacity", otherLinesOpacityHover);
        d3.selectAll(".circle").style("opacity", circleOpacityOnLineHover);
        d3.select(this)
          .style("opacity", lineOpacityHover)
          .style("stroke-width", lineStrokeHover)
          .style("cursor", "pointer");
      })
      .on("mouseout", function(d) {
        d3.selectAll(".line").style("opacity", lineOpacity);
        d3.selectAll(".circle").style("opacity", circleOpacity);
        d3.select(this)
          .style("stroke-width", lineStroke)
          .style("cursor", "none");
      });

    /* Add circles in the line */
    lines
      .selectAll("circle-group")
      .data(data)
      .enter()
      .append("g")
      .style("fill", (d, i) => color(i))
      .selectAll("circle")
      .data(d => d.values)
      .enter()
      .append("g")
      .attr("class", "circle")
      .on("mouseover", function(d) {
        d3.select(this)
          .style("cursor", "pointer")
          .append("text")
          .attr("class", "text")
          .text(`${d.temp}`)
          .attr("x", d => xScale(d.created) + 5)
          .attr("y", d => yScale(d.temp) - 10);
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")
          .transition()
          .duration(duration)
          .selectAll(".text")
          .remove();
      })
      .append("circle")
      .attr("cx", d => xScale(d.created))
      .attr("cy", d => yScale(d.temp))
      .attr("r", circleRadius)
      .style("opacity", circleOpacity)
      .on("mouseover", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadiusHover);
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadius);
      });

    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(5);
    var yAxis = d3.axisLeft(yScale).ticks(5);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxis)
      .append("text")
      .text("Time")
      .attr("fill", "#000")
      .attr("dx", "50%")
      .attr("dy", "4rem")
      .attr("class", "axis-title");

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("y", -35)
      .attr("dx", "-15rem")
      .attr("transform", "rotate(-90) ")
      .attr("fill", "#000")
      .text("Temperature")
      .attr("class", "axis-title");
  })
  .catch(error => {
    console.log(error);
  });

function getData() {
  return fetch("/api/temp/all?limit=216", {
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error;
    });
}
