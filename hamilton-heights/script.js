const isMobile = window.innerWidth < 768;

const map = L.map("map", { minZoom: 13, maxZoom: 16, scrollWheelZoom: !isMobile, zoomControl: !isMobile }).setView([40.82, -73.96], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

var pinIcon = L.divIcon({
    html: `
    <svg width="34" height="34" viewBox="0 0 24 24">
      <defs>
        <filter id="outerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="2" flood-color="#00000055"/>
        </filter>

        <filter id="insetShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="0"/>
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="arithmetic"
            k2="-1" k3="1"/>
          <feFlood flood-color="#00000033" result="color"/>
          <feComposite in="color" in2="SourceGraphic" operator="in" result="shadow"/>
          <feComposite in="shadow" in2="SourceGraphic" operator="over"/>
        </filter>
      </defs>

      <g filter="url(#outerShadow)">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill="#B9D9EB"
          stroke="#1D4F91"
          stroke-width="1.2"
          filter="url(#insetShadow)"
        />
        <circle cx="12" cy="9" r="2.5" fill="#1D4F91"/>
      </g>
    </svg>
  `,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 6],
});

const columbiaMarker = L.marker([40.80785, -73.9623], { icon: pinIcon }).addTo(map);
columbiaMarker.bindPopup("<b>Columbia's Morningside Heights campus");

map.dragging.disable();

(async function () {
    try {
        const res = await fetch("data/data.geojson");
        const data = await res.json();

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

            const neighborhoods = data.features.filter((d) => d.properties.BoroCode === 1);

            g.selectAll("path.neighborhoods")
                .data(neighborhoods)
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
                    tooltip
                        .style("display", "block")
                        .text(d.properties.NTAName)
                        .style("background-color", "white")
                        .style("color", d.properties.fill || "black");
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

            const district = data.features.filter((d) => d.properties.CounDist === 7);

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
