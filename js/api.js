// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 700 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var graphline = d3.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// parse the date / time
//var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L");

/////////

// import data from api
d3.csv("https://data.phila.gov/resource/st4m-d4h3.csv?"
  + "$select=issuedate,expirationdate,censustract,fulladdress"
  + "&$where=issuedate>%272016-08-01T00:00:00.000%27"
  + "&licensestatus=Active"
  + "&revenuecode=3202"
  + "&$order=issuedate"
//  + "&$limit=100"
  + "&$$app_token=8nwKL3zJBeBIdPKTZzwuKspfh", function (error, data) {
  if (error) throw error;

  // Make sure our numbers are really numbers
  data.forEach(function (d) {
    d.censustract = +d.censustract;
    d.issuedate = moment(d.issuedate);
    d.expirationdate = moment(d.expirationdate);
  });

  var licenseByDate = d3.nest()
  .key(function(d) { return d.issuedate; }).sortKeys(d3.ascending)
  .rollup(function(d) { return d.length; })
  .entries(data);
  console.log(JSON.stringify(licenseByDate));

  // Scale the range of the data
  x.domain(d3.extent(licenseByDate, function(d) { return d.key; }));
  y.domain([0, d3.max(licenseByDate, function(d) { return d.value; })]);

  // Add the graphline path.
  svg.append("path")
      .data([licenseByDate])
      .attr("class", "line")
      .attr("d", graphline);

  // Add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .text("Date");

  // Add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .attr("font-family", "sans-serif")
      .style("text-anchor", "middle")
      .text("Total");

  //console.log(data)
  //console.log(JSON.stringify(data));
});
