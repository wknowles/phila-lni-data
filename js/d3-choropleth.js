// set up map
var width = 470,
    height = 500;

var div = d3.select("body").append("div")
    .attr("class", "tooltip")

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");

var projection = d3.geoMercator()
    .center([-74.94, 40.002])
    .scale(80000);

var path = d3.geoPath()
    .projection(projection);


// read map file and data
queue()
  .defer(d3.json, "data/census_tracts.json")
  .defer(d3.csv, ("https://data.phila.gov/resource/st4m-d4h3.csv?"
  + "$select=censustract,count(censustract)"
  + "&$group=censustract"
  + "&$order=censustract"
  + "&$where=issuedate>%272016-01-01T00:00:00.000%27"
  + "&licensestatus=Active"
  + "&revenuecode=3202"
  + "&$$app_token=8nwKL3zJBeBIdPKTZzwuKspfh")) // app_token should be REDACTED but whatevs... security :-(
  .await(ready);

//Start of Choropleth drawing
  function ready(error, map, data) {
   var tractById = {};
   var totalById = {};

   data.forEach(function(d) {
    tractById[+d.censustract] = +d.count_censustract;
    totalById[+d.count_censustract] = +d.censustract;
  });

var minimumColor = "#fee0d2", maximumColor = "#de2d26";
var color = d3.scaleLinear()
              .domain(d3.extent(data, function(d) { return +d.count_censustract; }))
              .range([minimumColor, maximumColor]);

//console.log(d3.extent(data, function(d) { return +d.count_censustract; }))

//Draw Choropleth
  svg.append("g")
  .attr("class", "map")
  .selectAll("path")
  .data(topojson.feature(map, map.objects.Census_Tracts_2010).features)
  .enter().append("path")
  .attr("d", path)
  .attr("id", function(d) {
    return tractById[d.properties.NAME10];
  })
  .style("fill", function(d) {
    if (tractById[d3.format(".0f")(d.properties.NAME10)] === undefined){
      return ("#fcfcfc")
    } else {
      return color(tractById[d3.format(".0f")(d.properties.NAME10)]);
    };
  })
  //.style("opacity", 0.8)

    //Adding mouseevents
  .on("mouseover", function(d) {
    d3.select(this).transition().duration(300).style("opacity", 1);
    div.transition().duration(300)
    .style("opacity", 1)
    div.html("Census tract = " + d3.format(".0f")(d.properties.NAME10) + "<br> No. of licenses = " + tractById[d3.format(".0f")(d.properties.NAME10)])
    // console.log(d.properties.NAME10);
    // console.log(d3.format(".0f")(d.properties.NAME10));
    // var tractWhole = d3.format(".0f")(map, function(d) { return +d.properties.NAME10; })
  })
  .on("mouseout", function() {
    d3.select(this)
    .transition().duration(300)
    .style("opacity", 1);
    div.transition().duration(300)
    .style("opacity", 1);
  })

// console.log(totalById[3])
// console.log(tractById[3])
// console.log(JSON.stringify(totalById))

// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// svg.append("g")
// .attr("class", "legend")

//Adding legend for our Choropleth
var w = 60, h = 180;

var key = d3.select("#chart").append("svg")
            .attr("id", "key")
            .attr("class", "key")
            .attr("width", w)
            .attr("height", h);

var legend = key.append("defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "100%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

legend.append("stop").attr("offset", "0%").attr("stop-color", maximumColor).attr("stop-opacity", 1);
legend.append("stop").attr("offset", "100%").attr("stop-color", minimumColor).attr("stop-opacity", 1);

key.append("rect").attr("width", w - 40).attr("height", h - 20).style("fill", "url(#gradient)").attr("transform", "translate(0,10)");

var y = d3.scaleLinear()
          .range([h - 20, 0])
          .domain(d3.extent(data, function(d) { return +d.count_censustract; }));

var yAxis = d3.axisRight(y);
key.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(24,10)")
  .call(yAxis).append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 30).attr("dy", "1em")
  .style("text-anchor", "end")
  .text("Number of");


}; // <-- End of Choropleth drawing


