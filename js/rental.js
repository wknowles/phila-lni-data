d3.json("/data/active_housing.json", function(data) {
  // console.log(data[0]);
  var dateExtent = d3.extent(data, function(d) { return d.issue_date; });
  console.log(dateExtent);
  console.log(data.length);

var licensesTotalByYear = d3.nest()
  .key(function(d) { return d.issue_date.split("-")[0]; }).sortKeys(d3.ascending)
  //.key(function(d) { return d.census_tract; })
  .rollup(function(leaves) { return leaves.length; })
  .entries(data);
console.log(JSON.stringify(licensesTotalByYear));

//Width and height
var w = 800;
var h = 600;
var barPadding = 1;
//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

svg.selectAll("rect")
   .data(licensesTotalByYear)
   .enter()
   .append("rect")
   .attr("x", function(d, i) {
    return i * (w / licensesTotalByYear.length);
    })
   .attr("y", function(d) {
    return h - (d.value / 5)// height - data value
    })
   .attr("width", w / licensesTotalByYear.length - barPadding)
   .attr("height", function(d) {
    return (d.value / 5);
    })
   .attr("fill", "teal");

svg.selectAll("text")
  .data(licensesTotalByYear)
  .enter()
  .append("text")
  .text(function(d) {
      return d.value;
  })
  .attr("x", function(d, i) {
  return i * (w / licensesTotalByYear.length) + (w / licensesTotalByYear.length - barPadding) / 2;
  })
  .attr("y", function(d) {
      return h - (d.value / 5) - 10 ;
  })
  .attr("font-family", "sans-serif")
  .attr("text-anchor", "middle")
  .attr("font-size", "11px")
  .attr("fill", "black");
});

