// set up map
var width = 470,
  height = 500;

var div = d3.select('#chart').append('div')
    .attr('class', 'tooltip');

var svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'map');

var projection = d3.geoMercator()
    .center([-74.94, 40.002])
    .scale(80000);

var path = d3.geoPath()
    .projection(projection);

var censusTract = d3.select('#censusTract').insert('p')
    .attr('class', 'title');
var censusTotal = d3.select('#censusTotal').insert('p')
    .attr('class', 'title');

// read map file and data
queue()
  .defer(d3.json, 'data/census_tracts.json')
  .defer(d3.csv, ('https://data.phila.gov/resource/st4m-d4h3.csv?'
  + '$select=censustract,count(censustract)'
  + '&$group=censustract'
  + '&$order=censustract'
//  + '&$where=issuedate>%272016-01-01T00:00:00.000%27'
  + '&licensestatus=Active'
  + '&revenuecode=3202'
  + '&$$app_token=8nwKL3zJBeBIdPKTZzwuKspfh')) // app_token should be REDACTED but whatevs... security :-(
  .await(ready);

//Start of Choropleth drawing
function ready(error, map, data) {
  var tractById = {};
  var totalById = {};

  data.forEach(function(d) {
    tractById[+d.censustract] = +d.count_censustract;
    totalById[+d.count_censustract] = +d.censustract;
  });

  var minimumColor = '#fff', maximumColor = '#000';
  var color = d3.scaleLinear()
              .domain(d3.extent(data, function(d) { return +d.count_censustract; }))
              .range([minimumColor, maximumColor]);

//Draw Choropleth
  svg.append('g')
  .attr('class', 'map')
  .selectAll('path')
  .data(topojson.feature(map, map.objects.Census_Tracts_2010).features)
  .enter().append('path')
  .attr('d', path)
  .attr('id', function(d) {
    return tractById[d.properties.NAME10];
  })
  .style('fill', function(d) {
    if (tractById[d3.format('.0f')(d.properties.NAME10)] === undefined){
      return ('url(#smalldot)');
    } else {
      return color(tractById[d3.format('.0f')(d.properties.NAME10)]);
    }
  })

//Adding mouseevents
  .on('mouseover', function(d) {
    d3.select(this).transition().duration(300).style('opacity', 1);
    div.transition().duration(300)
    .style('opacity', 1);
    censusTract.html(d3.format('.0f')(d.properties.NAME10));
    censusTotal.html(tractById[d3.format('.0f')(d.properties.NAME10)]);
    //div.html('Census tract = ' + d3.format('.0f')(d.properties.NAME10) + '<br> No. of licenses = ' + tractById[d3.format('.0f')(d.properties.NAME10)]);
    // console.log(d.properties.NAME10);
    // console.log(d3.format(".0f")(d.properties.NAME10));
  })
  .on('mouseout', function() {
    d3.select(this)
    .transition().duration(300)
    .style('opacity', 1);
    div.transition().duration(300)
    .style('opacity', 1);
    censusTract.html('-');
    censusTotal.html('-');
  });



//console.log(d3.extent(data, function(d) { return +d.count_censustract; }))
//console.log(d3.selectAll(data, function(d) { return +d.count_censustract; }).size())
// console.log(totalById[3])
// console.log(tractById[3])
//console.log(JSON.stringify(totalById))

//Add key to Choropleth
  var w = 250, h = 60;

  var key = svg.append('g')
            .attr('width', w)
            .attr('height', h)
            .attr('id', 'key')
            .attr('class', 'key');

  var legend = key.append('defs')
                .append('svg:linearGradient')
                .attr('id', 'gradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '0%')
                .attr('spreadMethod', 'pad');

  legend.append('stop').attr('offset', '0%').attr('stop-color', minimumColor).attr('stop-opacity', 1);
  legend.append('stop').attr('offset', '100%').attr('stop-color', maximumColor).attr('stop-opacity', 1);

  key.append('rect').attr('width', w - 10).attr('height', h - 40).style('fill', 'url(#gradient)').attr('transform', 'translate(5,0)');

  var x = d3.scaleLinear()
          .range([ 0, w - 10])
          .domain(d3.extent(data, function(d) { return +d.count_censustract; }));

  var xAxis = d3.axisBottom(x);
  key.append('g')
  .attr('class', 'z axis')
  .attr('transform', 'translate(5,20)')
  .call(xAxis).selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-65)' );
//end of key

}// <-- End of Choropleth drawing
