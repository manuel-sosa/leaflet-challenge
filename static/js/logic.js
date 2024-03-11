// Map object with center and zoom level
var myMap = L.map("map", {
    center: [40.7608, -111.8910], // Centrally-located coordinates
    zoom: 5
});

// Adding a tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1IjoibWFzb3NhIiwiYSI6ImNsdG40Y2dsODAyd2EyaW5pcnIwOHcwajQifQ.KH8uolZnXie3Ou-C2od7MQ"
}).addTo(myMap);

// GeoJSON URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Fetch the GeoJSON data
d3.json(queryUrl).then(function(data) {
    // GeoJSON layer containing the features array on the earthquake data
    L.geoJSON(data, {
        // pointToLayer to create circle markers
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 4, // Scale circle size by earthquake magnitude
                fillColor: getColor(feature.geometry.coordinates[2]), // Call getColor function based on depth
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        // onEachFeature to create popups
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place +
                            "<br>Depth: " + feature.geometry.coordinates[2] + " km");
        }
    }).addTo(myMap);
});

// Function to determine marker color based on earthquake depth
function getColor(depth) {
    return depth > 90 ? '#EA2B1F' :
           depth > 70 ? '#EA822C' :
           depth > 50 ? '#EE9C00' :
           depth > 30 ? '#EECC00' :
           depth > 10 ? '#D4EE00' :
                        '#98EE00';
}

var legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0, 10, 30, 50, 70, 90];
    var colors = ['#98EE00', '#D4EE00', '#EECC00', '#EE9C00', '#EA822C', '#EA2B1F'];
    var labels = [];

    // min & max
    var legendInfo = "<h1>Earthquake Depth</h1>" +
        "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + " km</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + " km</div>" +
        "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};

legend.addTo(myMap);
