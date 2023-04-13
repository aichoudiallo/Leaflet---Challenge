

// Create the tile layer that will be the background of our map.
var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// Create the map object with options.
var map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 3,

});
basemap.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
    function earthquakeStyle(feature) {
        return {
            opacity: 1,
            fillColor: earthquakeColor(feature.geometry.coordinates[2]),
            radius: earthquakeRadius(feature.properties.mag),
            weight: 0.5
        };
    }

    function earthquakeColor(depth){

        if (depth>90){
            return "#330000"
        }
    
        if (depth>70){
            return "#990000"
        }

        if (depth>50){
            return "#CC6600"
        }

        if (depth>30){
            return "#EECC00"
        }

        if (depth>10){
            return "#D4EE00"
        }

        else {
            return "#98ee00"
        }
    
    
    }
function earthquakeRadius(magnitude){

    if(magnitude===0){

        return 1;
    }
    return magnitude*5;
}

L.geoJson(data,{ 

    pointToLayer:function(feature,latlng){

        return L.circleMarker(latlng);
    },

    style:earthquakeStyle,

    onEachFeature:function (feature, layer) {
        layer.bindPopup(
          "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
        );
      }

      

}).addTo (map);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        depth = [0, 10,30,50,70,90],
        colors = ["#98ee00","#D4EE00","#EECC00","#CC6600","#990000","#330000"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

});