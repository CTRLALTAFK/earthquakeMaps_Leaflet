// Create the tile layer that will be the background of our map
var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  accessToken: API_KEY,
  id: "mapbox.streets"
  
});
// Create the map with our layers
var map = L.map("map", {
  center: [35.0078, -97.0929],
  zoom: 3
  });

// Add our 'graymap' tile layer to the map
graymap.addTo(map)

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"

d3.json(queryUrl, function (data){
  
  function markerRadius(magnitude){
    if (magnitude == 0){return 1};
    return magnitude * 2;

}
  function markerColor(magnitude){
    switch (true) {
      case magnitude > 5:
        return "#EA2C2C";
      case magnitude > 4:
        return "#EA822C";
      case magnitude > 3:
        return "#EE9C00";
      case magnitude > 2:
        return "#EECC00";
      case magnitude > 1:
        return "#D4EE00";
      default:
        return "#98EE00";
}}
  function markerStyle(feature){
    return {opacity: 55, 
      fillOpacity:55,
      fillColor: markerColor(feature.properties.mag),
      radius: markerRadius(feature.properties.mag), }
}
L.geoJSON(data, {
  pointTolayer: function(feature, latlong){
    return L.circleMarker(latlong);
  }, 
  style: markerStyle,
    onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag +
    "<br>Location: " + feature.properties.place);
}}).addTo(map);

var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function() {
  var div = L
    .DomUtil
    .create("div", "info legend");

  var grades = [0, 1, 2, 3, 4, 5];
  var colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];


  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
      grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
};


legend.addTo(map);
  

});