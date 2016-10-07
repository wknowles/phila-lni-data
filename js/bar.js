var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
//var parseDate = d3.timeParse("%Y");

var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)
    //.tickFormat(moment().format("m"))

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(10);

var svgBar = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// import data from api
d3.csv("https://data.phila.gov/resource/st4m-d4h3.csv?"
  + "$select=issuedate,expirationdate,censustract,fulladdress"
 + "&$where=issuedate>%272016-01-01T00:00:00.000%27"
  + "&licensestatus=Active"
  + "&revenuecode=3202"
  + "&$order=issuedate"
  // + "&$limit=10"
  // app_token should be REDACTED but whatevs... security :-(
  + "&$$app_token=8nwKL3zJBeBIdPKTZzwuKspfh", function (error, data) {
  if (error) throw error;

  // Make sure our numbers are really numbers
  data.forEach(function (d) {
    d.censustract = +d.censustract;
    d.issuedate = moment(d.issuedate);
    //d.issuedate = parseTime(d.issuedate);
    d.expirationdate = moment(d.expirationdate);
  });

  // nest and rollup data
  var licenseByDate = d3.nest()
    .key(function(d) { return d.issuedate.month() })
    //.key(function(d) { return d.censustract; })
    .rollup(function(d) { return d.length; })
    .entries(data);

  //console.log(JSON.stringify(licenseByDate));
  x.domain(licenseByDate.map(function(d) { return d.key; }));
  y.domain([0, d3.max(licenseByDate, function(d) { return d.value; })]);

  svgBar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svgBar.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value");

  svgBar.selectAll("bar")
      .data(licenseByDate)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

});
