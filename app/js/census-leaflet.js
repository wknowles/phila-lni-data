var map = L.map('leaflet').setView([40.008, -75.1652], 11);
    map.options.minZoom = 11;
    map.options.maxZoom = 14;

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>' }).addTo(map);

var geojson;

function getColor(d) {
  return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
  return {
    fillColor: '#fff',
    weight: 1,
    opacity: 1,
    color: '#ff7800',
    dashArray: '3',
    fillOpacity: 0.3
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 3,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}
function resetHighlight(e) {
  geojson.resetStyle(e.target);
}
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

// begin info
var info = L.control();
info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

//console.log(censusLayer.Census_Tracts_2010.properties.NAMELSAD10)

// method that we will use to update the control based on feature properties passed
info.update = function (properties) {
  this._div.innerHTML = '<h4>Active rental licenses in Philadelphia</h4>' +  (properties ?
        '<b>' + properties.Census_Tracts_2010.properties.NAMELSAD10  + '</b><br />'  + ' people / mi<sup>2</sup>'
        : 'Hover over a census tract');
};
info.addTo(map);
// end info

// begin legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(map);
// end legend


geojson = L.geoJson(null, {
    // http://leafletjs.com/reference.html#geojson-style
  style: style,
  onEachFeature: onEachFeature
});


var censusLayer = omnivore.topojson('data/census_tracts.json', null, geojson)
    .addTo(map);
