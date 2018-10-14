// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 250
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

d3.csv("data.csv").then(function(stateData) {
        // parse data
          stateData.forEach(function(data) {
          data.poverty = +data.poverty;
          data.healthcare = +data.healthcare;
          data.abbr = data.abbr
          
        });

// Step 2: Create scale functions
// ==============================

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.poverty)-.5, d3.max(stateData, d => d.poverty)])
        .range([0, width]);
  
      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.healthcare)-1, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);
    
// Step 3: Create axis functions
// ==============================

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// Step 4: Append Axes to the chart
// ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", stateData => xLinearScale(stateData.poverty))
    .attr("cy", stateData => yLinearScale(stateData.healthcare))
    .attr("r", "15")
    .attr("fill", "darkblue")
    .attr("opacity", ".5");

    var textBubble = chartGroup.append("g")
        .selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .text(stateData => stateData.abbr)
        .attr("font-size", "12px")
        .style('fill', 'white')
        .attr("x", stateData => xLinearScale(stateData[chosenXAxis])-6)
        .attr("y", stateData => yLinearScale(stateData[chosenYAxis])+3);
    
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Poverty Levels: ${d.poverty}<br>HealthCare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(stateData) {
      toolTip.show(stateData, this);
    })
      // onmouseout event
      .on("mouseout", function(stateData, index) {
        toolTip.hide(stateData);
      });
      
      textBubble.on("mouseover", function(stateData) {
        toolTip.show(stateData, this);
      })
        // onmouseout event
        .on("mouseout", function(stateData, index) {
          toolTip.hide(stateData);
        });


// Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 200)
        .attr("x", 0 - (height/1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    });
  


