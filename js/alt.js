// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// parse the date / time
var parseTimeAlt = d3.timeParse("%Y");
var bisectDate = d3.bisector(function(d) { return d.year; }).left;



// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valuelineAlt = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.total); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svgAlt = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/data.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.year = parseTimeAlt(d.year);
      d.total = +d.total;
      // .getFullYear() does just that!
      console.log(d.year.getFullYear(), d.total)
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  // Add the valuelineAlt path.
  svgAlt.append("path")
      .data([data])
      .attr("class", "lineAlt")
      .attr("d", valuelineAlt);

  // Add the x Axis
  svgAlt.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // text label for the x axis
  svgAlt.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .text("Year - from small csv");

  // Add the y Axis
  svgAlt.append("g")
      .call(d3.axisLeft(y));

  // text label for the y axis
  svgAlt.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .attr("font-family", "sans-serif")
      .style("text-anchor", "middle")
      .text("Total");

var focus = svgAlt.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .attr("r", 4.5);

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  svgAlt.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.year > d1.year - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.year) + "," + y(d.total) + ")");
    focus.select("text").text(d.total);
  }

});
