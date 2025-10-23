const regions = d3.selectAll(".district7");

regions
  .on("mouseover", function () {
    d3.select(this).transition().duration(200).attr("fill", "#ff6600");
  })
  .on("mouseout", function () {
    d3.select(this).transition().duration(200).attr("fill", "#ccc");
  });

const svg = document.querySelector("svg");
const box = svg.getBBox();
console.log(box);
// svg.setAttribute("viewBox", `${box.x} 0 ${box.width} 900`);
svg.setAttribute("viewBox", `${box.x} 150 ${box.width + 25} 349`);

const rect = document.querySelector("rect");
rect.setAttribute("x", `${box.x}`);
rect.setAttribute("y", `150`);
rect.setAttribute("width", `${box.width + 25}`);
rect.setAttribute("height", `349`);

// svg.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);

// function generateRandomHexColor() {
//   const randomColor = Math.floor(Math.random() * 16777215).toString(16);
//   return `#${randomColor.padStart(6, "0")}`;
// }

// const paths = d3.selectAll("path");
// paths.each(function (d, i) {
//   const bbox = this.getBBox();
//   const top = bbox.y;
//   const bottom = bbox.y + bbox.height;
//   if (top > (350 + 150) || bottom < 150) {
//     d3.select(this).attr("fill", generateRandomHexColor());
//   }
// });