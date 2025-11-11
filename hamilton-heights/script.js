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

const map = L.map("map", { minZoom: 13, maxZoom: 16 }).setView([40.82, -73.96], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const columbiaMarker = L.marker([40.8075, -73.9626]).addTo(map);
columbiaMarker.bindPopup("<b>Columbia's Morningside Heights campus");

const hamiltonHeightsMarker = L.marker([40.825, -73.9483]).addTo(map);
hamiltonHeightsMarker.bindPopup("<b>Hamilton Heights</b>");

map.dragging.disable();

(async function () {
    try {
        const districtsRes = await fetch("data/nyc-city-council-districts.geojson");
        const districtsData = await districtsRes.json();

        const neighborhoodsRes = await fetch("data/nyc-neighborhoods.geojson");
        const neighborhoodsData = await neighborhoodsRes.json();

        const svgLayer = L.svg();
        svgLayer.addTo(map);

        const svg = d3.select(map.getPanes().overlayPane).select("svg");
        svg.attr("pointer-events", "none");
        const g = svg.append("g").attr("class", "d3-overlay");

        drawOverlay();
        map.on("moveend", drawOverlay);

        function drawOverlay() {
            g.selectAll("*").remove();

            const transform = d3.geoTransform({
                point: function (x, y) {
                    const point = map.latLngToLayerPoint(new L.LatLng(y, x));
                    this.stream.point(point.x, point.y);
                },
            });
            const path = d3.geoPath().projection(transform);

            const tooltip = d3.select("#tooltip");

            g.selectAll("path")
                .data(neighborhoodsData.features)
                .enter()
                .append("path")
                .attr("class", "area")
                .attr("d", path)
                .attr("stroke", "#000")
                .attr("fill", (d) => d.properties.fill || "#ccc")
                .attr("fill-opacity", (d) => d.properties.opacity || 0.5)
                .style("pointer-events", "all")
                .style("cursor", "pointer")
                .on("mouseover", function (event, d) {
                    tooltip.style("display", "block").text(d.properties.NTAName).style("background-color", d.properties.fill || "white").style("color", "black");
                    d3.select(this).attr("fill-opacity", (d) => d.properties.opacity || 0.8);
                })
                .on("mousemove", function (event) {
                    tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 28 + "px");
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none");
                    d3.selectAll("path.area").attr("stroke-width", 1);
                    d3.selectAll("path.area").attr("fill-opacity", (d) => d.properties.opacity || 0.5);
                });

            const district = districtsData.features.filter((d) => d.properties.CounDist === 7);

            g.selectAll("path.district")
                .data(district)
                .enter()
                .append("path")
                .attr("class", "highlight")
                .attr("d", path)
                .attr("fill", "#003865")
                .attr("fill-opacity", 0.4)
                .style("pointer-events", "all")
                .style("cursor", "pointer")
                .on("mouseover", function (event, d) {
                    tooltip.style("display", "block").text("City Council District 7").style("background-color", "#003865").style("color", "white");
                })
                .on("mousemove", function (event) {
                    tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 28 + "px");
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none");
                });
        }
    } catch (err) {
        console.error("Error loading GeoJSON:", err);
    }
})();
