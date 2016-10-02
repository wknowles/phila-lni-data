// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value); });

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d");

// import data
d3.csv("data/active_rental.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.issue_date = parseTime(d.issue_date);
  });

// keys are always treated as strings -- https://stackoverflow.com/questions/25576853/d3-nest-formatting-date-incorrectly

// nest, key and rollups
var licensesTotalByYear = d3.nest()
  .key(function(d) { return d.issue_date.getFullYear(); }).sortKeys(d3.ascending)
  .rollup(function(d) { return d.length; })
  .entries(data);
console.log(JSON.stringify(licensesTotalByYear));

// Scale the range of the data
x.domain(d3.extent(licensesTotalByYear, function(d) { return d.key; }));
y.domain([0, d3.max(licensesTotalByYear, function(d) { return d.value; })]);

// Add the valueline path.
  svg.append("path")
      .data([licensesTotalByYear])
      .attr("class", "line")
      .attr("d", valueline);

// Add the x Axis
svg.append("g")
    .attr("transform", "translate(0," + (height)  + ")")
    .call(d3.axisBottom(x));
// text label for the x axis
svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .text("Year");
// Add the y Axis
svg.append("g")
    .call(d3.axisLeft(y));
// text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .text("Value");
});
