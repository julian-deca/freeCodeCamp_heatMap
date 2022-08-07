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
  console.log(fullData);
}
