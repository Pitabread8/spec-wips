const regions = d3.selectAll(".neighborhood");
const neighborhoodName = d3.select("#neighborhood-name");

regions
  .on("mouseover", function () {
    d3.select(this).transition().duration(200).attr("fill", "#003865");
    neighborhoodName.text(d3.select(this).attr("id"));
  })
  .on("mouseout", function () {
    d3.select(this).transition().duration(200).attr("fill", "#ccc");
    neighborhoodName.text("Hover over a neighborhood!");
  });

const svg = document.querySelector("svg");
const box = svg.getBBox();
svg.setAttribute("viewBox", `${box.x} ${box.y - 1} ${box.width} ${box.height + 2}`);

const rect = document.querySelector("rect");
rect.setAttribute("x", box.x + 10);
rect.setAttribute("y", box.y + 50);

const legend = document.querySelector("#legend");
legend.setAttribute("x", box.x + 185);
legend.setAttribute("y", box.y + 70);
