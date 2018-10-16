function makeResponsive() {

  var svgWidth = 1200;
  var svgHeight = 650;

  var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  var chosenXAxis = "poverty";
  var chosenYAxis = "healthcare";

  // ===========================================
  // Create a function used for updating both x-scale and y-scale var upon click on axis label
  // X-Scale function 
  function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
    return xLinearScale;
  }

  // Y-Scale function
  function yScale(data, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0])
    return yLinearScale;
  }
  // ==============================================
  // Create a functions used for updating axes var upon clicking on axis label
  // X-Axis function
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
  }

  // Y-Axis function
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  }

  // ===============================================
  // Function used for updating circles group with a transition to new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }

  function renderCircles2(circles2Group, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circles2Group.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
    return circles2Group;
  }

  function renderCircles3(circles3Group, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circles3Group.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
    return circles3Group;
  }

  // // function used for updating circles group with new tooltip
  function toolTipXAxis(chosenXAxis) {
    if (chosenXAxis === "poverty") {
      var label = "In Poverty(%)";
    } else if (chosenXAxis === "age") {
      var label = "Age(Median)";
    } else {
      var label = "House Income(Median)";
    }
    return label;
  }

  function toolTipYAxis (chosenYAxis) {
    var label = ""
    if (chosenYAxis === "healthcare") {
      label = "Lacks HealthCare(%)"; 
    } else if (chosenYAxis === "smokes") {
      label = "Smokes (%)"; 
    } else {
      label = "Obese (%)"
    }
    return label;
  }

  // Import Data
  d3.csv("/assets/data/data.csv")
    .then(function(censusData) {

      // parse data and cast
      censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.states = data.abbr;

        // console.log("Proverty:", data.poverty);
        // console.log("Age:", data.age)
        // console.log("Income:", data.income)
        // console.log("Smokes:", data.smokes)
        // console.log("HealthCare:", data.healthcare)
        // console.log("Obesity:", data.obesity)
        console.log("State:", data.states)
      });

      // ==============================================

      // xLinear Scale function above csv import
      var xLinearScale = xScale(censusData, chosenXAxis);
      var yLinearScale = yScale(censusData, chosenYAxis);

      // Create axes
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);


      // Create inital axis functions
      var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        // .attr("transform", `translate(0, ${width}`)
        .call(leftAxis);

      // Set variable when appending text into circles
      var graph = chartGroup.append("g");

      // // =============================================
      // set up circles
      var circlesGroup = graph.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "14")
        .attr("class", "stateCircle")
        .attr("opacity", "0.6")

      var circles2Group = graph.selectAll("circleObject")
        .data(censusData)
        .enter()
        .append("circleObject")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("opacity", ".5")
        .attr("class", "stateShape")
        .html(function(d) {
          var blah = (`${d.abbr}`).toLowerCase();
          return (`<i class="mg map-us-${blah} mg-3x"></i>`);
        });

      // Apend text to circles
      var circles2Group = graph.selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .text(function(d) {
          return d.abbr;
        })
        .attr("x", function(d) {
          return xLinearScale(d[chosenXAxis]);
        })
        .attr("y", function(d) {
          return yLinearScale(d[chosenYAxis]);
        })
        // .attr("font-family", "open sans")
        .attr("font-size", "12px")
        .attr("class", "stateText");

      // Create group for 2 x-axis labels
      var labelsXGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

      var povertyLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active",true)
        // .attr("class", "axisText")
        .text("In Poverty(%)");

      var ageLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab event listener
        .classed("inactive", true)
        // .attr("class", "axisText")
        .text("Age (Median)");

      var incomeLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income(Median)");

      // Create group for 2 y-axis
      var labelsYGroup = chartGroup.append("g");
        // .attr("transform", `translate(${width / 2}, ${height + 20})`);

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

      // Inialize Tooltip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60]) 
        .html(function(d) {
          return(`<br>State:${d.state}<br>Poverty:${d.poverty}<br>Healthcare:${d.healthcare}`);
        
        });

      // Create tooltip in chartGroup
      chartGroup.call(toolTip);

      // Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      // Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });

      // updateToolTip function above csv import
      // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      //x axis labels event listener
      labelsXGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXaxis with value
          chosenXAxis = value;

          console.log(chosenXAxis);

          // function here found above csv import
          // updates x and y scale for new data
          xLinearScale = xScale(censusData, chosenXAxis);
          // yLinearScale = yScale(censusData, chosenYAxis);

          //updates x and y axes with transition
          xAxis = renderXAxes(xLinearScale, xAxis);


          // update circle with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          circles2Group = renderCircles2(circles2Group, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          // circles3Group = renderCircles3(circles3Group, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          // if changes classes to change bold text
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

      // y axis labels event listener
      labelsYGroup.selectAll("text")
        .on("click", function() {
        //get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

          // replaces chosenYAxis with value
          chosenYAxis = value;

          console.log(chosenYAxis);

          // updates y scale for new data
          yLinearScale = yScale(censusData, chosenYAxis);

          // updates x axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);

          // updates circles with new y values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          circles2Group = renderCircles2(circles2Group, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          // circles3Group = renderCircles3(circles3Group, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          // changes classes to change bold text
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
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);