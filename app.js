// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data
d3.csv("data.csv").then(function(stateData) {

  console.log(stateData);

  stateData.forEach(function(data) {
    data.abbr = data.abbr;
    data.poverty = +data.poverty;
    data.health = +data.healthcare;
  });

  // d3.extent returns an array containing the min and max values for the property specified
  var xLinearScale = d3.scaleLinear()
    .range([0, chartWidth])
    .domain([8, d3.max(stateData, data => data.poverty)]);
    //.domain(d3.extent(stateData, data => data.poverty));

  // Configure a linear scale with a range between the chartHeight and 0
  // Set the domain for the xLinearScale function
  var yLinearScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([0, d3.max(stateData, data => data.health)]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Append Axes Titles
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 20)
        .attr("x", 0 - (svgHeight / 2))
        .attr("font-weight", 700)
        //.attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
  
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 50})`)
        .attr("class", "axisText")
        .attr("font-weight", 700)
        .text("In Poverty (%)");

    // Add dots
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", data => xLinearScale(data.poverty))
        .attr("cy", data => yLinearScale(data.health))
        .attr("r", "10")
        .classed("stateCircle", true);

    chartGroup.selectAll(null)
        .data(stateData)
        .enter()
        .append("text")
        .attr("x", data => xLinearScale(data.poverty))
        .attr("y", data => yLinearScale(data.health))
        .text(function(d) { return d.abbr; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "8px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");

      //alert("done");

}).catch(function(error) {
  console.log(error);
});

