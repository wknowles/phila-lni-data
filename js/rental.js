d3.json("data/active_housing.json", function(data) {
var dateExtent = d3.extent(data, function(d) { return d.issue_date; });
console.log(data.length);

var licensesTotalByYear = d3.nest()
  .key(function(d) { return d.issue_date.split("-")[0]; }).sortKeys(d3.ascending)
  .rollup(function(d) { return d.length; })
  .entries(data);
console.log(JSON.stringify(licensesTotalByYear));

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

svg.selectAll("rect")
   .data(licensesTotalByYear)
   .enter()
   .append("rect")
   .attr("x", function(d, i) {
    return i * (width / licensesTotalByYear.length);
    })
   .attr("y", function(d) {
    return height - (d.value / 5)// height - data value
    })
   .attr("width", width / licensesTotalByYear.length)
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
  return i * (width / licensesTotalByYear.length) + (width / licensesTotalByYear.length) / 2;
  })
  .attr("y", function(d) {
      return height - (d.value / 5) - 10;
  })
  .attr("font-family", "sans-serif")
  .attr("text-anchor", "middle")
  .attr("font-size", "11px")
  .attr("fill", "black");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

  // Scale the range of the data
  x.domain(d3.extent(licensesTotalByYear, function(d) { return d.key; }));
  y.domain([0, d3.max(licensesTotalByYear, function(d) { return d.value; })]);

// Add the x Axis
svg.append("g")
    .attr("transform", "translate(0," + (height)  + ")")
    .call(d3.axisBottom(x));
// Add the y Axis
svg.append("g")
    .call(d3.axisLeft(y));
svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Year");
});
