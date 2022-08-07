d3.select("div")
  .append("h1")
  .attr("id", "title")
  .text("Monthly Global Land-Surface Temperature");
const w = 900;
const h = 700;
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
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((d) => {
      return d;
    });
}
async function proceede() {
  const fullData = await getData();
  console.log(fullData);
}
