var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
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

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Parameters 
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function xScale(stateData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width]);
  
    return xLinearScale;
  }

  function yScale(stateData, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
        d3.max(stateData, d => d[chosenYAxis]) * 1.1
      ])
      .range([height, 0])
    return yLinearScale;
    }

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1500)
      .call(bottomAxis);
  
    return xAxis;
  }

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1500)
      .call(leftAxis);
  
    return yAxis;
  }

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1500)
      .attr("cx", d => newXScale(d[chosenXAxis]) + 11)
      .attr("cy", d => newYScale(d[chosenYAxis]) - 5);
  
    return circlesGroup;
  }

function transitionText(textBubbles, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale){
    textBubbles.transition()
      .duration(1500)
      .text(stateData => stateData.abbr)
      .attr("x", stateData => xLinearScale(stateData[chosenXAxis]))
      .attr("y", stateData => yLinearScale(stateData[chosenYAxis]));

    return textBubbles;
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var labelX = "Poverty:";
  }
  else if(chosenXAxis === "age"){
    var labelX = "Age:";
  }
  else if (chosenXAxis === "income"){
    var labelX = "Income:";
  }

  if (chosenYAxis === "obesity") {
    var labelY = "Obesity:";
  }
  else if(chosenYAxis === "smokes"){
    var labelY = "Smokes:";
  }
  else if (chosenYAxis === "healthcare"){
    var labelY = "Healthcare:";
  }
  
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -100])
    .html(function(d) {
      return (`${labelY} ${d[chosenYAxis]}<br>${labelX} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

  //TIME TO USE ALL THE FUNCTIONS
  d3.csv("data.csv").then(function(stateData){
        stateData.forEach(function(data){
            data.obesity = +data.obesity;
            data.smokes = +data.smokes;
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
        });

    xLinearScale = xScale(stateData, chosenXAxis);
    yLinearScale = yScale(stateData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
    
    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]) + 10)
    .attr("cy", d => yLinearScale(d[chosenYAxis]) - 5)
    .attr("r", 20)
    .attr("fill", "darkblue")
    .attr("opacity", ".5");

    var textBubbles = chartGroup.selectAll("cirlceObject")
            .data(stateData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]));

    var labelsXGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("% in Poverty");

     var ageLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");

    var incomeLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income");

    var labelsYGroup = chartGroup.append("g")

    var healhcareLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare (%)");

      var smokesLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes(%)");

      var obesityLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obese(%)");
      
      var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
labelsXGroup.selectAll("text")
        .on("click", function() {

        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            chosenXAxis = value;

            xLinearScale = xScale(stateData, chosenXAxis);
            xAxis = renderXAxes(xLinearScale, xAxis);

            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
            textBubbles = transitionText(textBubbles, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale);
            

            if (chosenXAxis === "poverty") {
                povertyLabel
                  .classed("active", true)
                  .classed("inactive", false);
                ageLabel
                  .classed("active", false)
                  .classed("inactive", true);
                incomeLabel
                  .classed("active", false)
                  .classed("inactive", true);
              } else if (chosenXAxis === "age") {
                povertyLabel
                  .classed("active", false)
                  .classed("inactive", true);
                ageLabel
                  .classed("active", true)
                  .classed("inactive", false);
                incomeLabel
                  .classed("active", false)
                  .classed("inactive", true);
              } else {
                povertyLabel
                  .classed("active", false)
                  .classed("inactive", true);
                ageLabel
                  .classed("active", false)
                  .classed("inactive", true);
                incomeLabel
                  .classed("active", true)
                  .classed("inactive", false);
              }
            }
        });

labelsYGroup.selectAll("text")
        .on("click", function() {

        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            chosenYAxis = value;

            yLinearScale = yScale(stateData, chosenYAxis);
            yAxis = renderYAxes(yLinearScale, yAxis);

            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
            textBubbles = transitionText(textBubbles, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale);
            
            if (chosenYAxis === "healthcare") {
                healhcareLabel
                  .classed("active", true)
                  .classed("inactive", false);
                smokesLabel
                  .classed("active", false)
                  .classed("inactive", true);
                obesityLabel
                  .classed("active", false)
                  .classed("inactive", true);
              } else if (chosenYAxis === "smokes") {
                healhcareLabel
                  .classed("active", false)
                  .classed("inactive", true);
                smokesLabel
                  .classed("active", true)
                  .classed("inactive", false);
                obesityLabel
                  .classed("active", false)
                  .classed("inactive", true);
              } else {
                healhcareLabel
                  .classed("active", false)
                  .classed("inactive", true);
                smokesLabel
                  .classed("active", false)
                  .classed("inactive", true);
                obesityLabel
                  .classed("active", true)
                  .classed("inactive", false);
              }
            }
        });

  });