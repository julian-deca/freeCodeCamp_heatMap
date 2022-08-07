d3.select("div")
  .append("h1")
  .attr("id", "title")
  .text("Monthly Global Land-Surface Temperature");
d3.select("div")
  .append("h2")
  .attr("id", "description")
  .text("1753 - 2015: base temperature 8.66℃");
const w = 900;
const h = 500;
const padding = 70;
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].reverse();
const svg = d3.select("div").append("svg").attr("width", w).attr("height", h);
const div = d3
  .select("div")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);
proceede();

async function getData() {
  return fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
    .then((response) => response.json())
    .then((d) => {
      return d;
    });
}
async function proceede() {
  const fullData = await getData();
  const mVariance = fullData.monthlyVariance;
  const baseTemp = fullData.baseTemperature;
  const month = mVariance.map((d) => {
    return d.month - 1;
  });
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(mVariance, (d) => {
        return d.year;
      }),
      d3.max(mVariance, (d) => {
        return d.year;
      }),
    ])
    .range([padding, w - padding]);
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  svg
    .append("g")
    .attr("transform", "translate(0, " + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(mVariance, (d) => {
        return d.month;
      }),
      d3.max(mVariance, (d) => {
        return d.month;
      }),
    ])
    .range([h - padding, padding]);

  const yAxis = d3.axisLeft(yScale).tickFormat((d, i) => {
    console.log(i);
    return months[i];
  });

  svg
    .append("g")
    .attr("transform", "translate( " + padding + ",0)")
    .attr("id", "y-axis")
    .call(yAxis);

  svg
    .selectAll("rect")
    .data(mVariance)
    .enter()
    .append("rect")
    .attr("width", (d) => {
      return (
        w /
        (d3.max(mVariance, (d) => {
          return d.year;
        }) -
          d3.min(mVariance, (d) => {
            return d.year;
          }))
      );
    })
    .attr("height", (h - padding) / 12)
    .attr("x", (d) => {
      return xScale(d.year);
    })
    .attr("y", (d, i) => {
      return h - yScale(d.month) - (h - padding) / 12;
    })
    .attr("class", "cell")
    .attr("fill", (d) => {
      const dv = d.variance;
      switch (true) {
        case dv >= 4:
          return "red";
        case dv >= 2.5:
          return " rgb(194, 80, 4)";
        case dv >= 2:
          return "rgb(255, 102, 0)";
        case dv >= 1.5:
          return "rgb(194, 81, 6)";
        case dv >= 1:
          return "rgb(255, 136, 0)";
        case dv >= 0.3:
          return "rgb(255, 230, 0)";
        case dv >= -0.8 && dv <= 0.3:
          return "yellow";
        case dv >= -0.8:
          return "rgb(227, 253, 179)";
        case dv >= -1.5:
          return "rgb(197, 243, 255)";
        case dv >= -2:
          return "rgb(78, 149, 255)";
        case dv >= -3:
          return "rgb(100, 136, 255)";
        case dv >= -3.5:
          return "rgb(93, 131, 255)";
        case dv <= -3.5:
          return "rgb(84, 84, 255)";
      }
    })
    .attr("data-month", (d, i) => {
      return month[i];
    })
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => baseTemp - d.variance)
    .on("mouseover", (evt, d) => {
      div
        .style("opacity", 0.9)
        .attr("data-year", d.year)
        .html(
          months[12 - d.month] +
            " " +
            d.year +
            "<br/>" +
            Math.round((baseTemp - d.variance) * 10) / 10 +
            "°C" +
            "<br/>" +
            Math.round(d.variance * 10) / 10 +
            "°C"
        )
        .style("left", evt.x + 20 + "px")
        .style("top", evt.y + "px");
    })
    .on("mouseout", (evt, d) => {
      div.style("opacity", 0);
    });

  console.log(fullData);
}
