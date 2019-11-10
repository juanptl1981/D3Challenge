// Set size of svg and margins
let svgWidth = 960;
let svgHeight = 500;
let margin = {
   top: 20,
   right: 40,
   bottom: 60,
   left: 100
};
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
  let chartGroup = svg.append("g")
     .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(csvdata) {
   console.log(csvdata);  
    // parse data
      csvdata.forEach(function(data) {
         data.poverty = +data.poverty;
         data.obesity = +data.obesity;
         console.log("parseData", data);
      });

   let xLinearScale = d3.scaleLinear()
      .domain([7, d3.max(csvdata, d => d.poverty)])
      .range([0, width]); 

   let yLinearScale = d3.scaleLinear()
      .domain([12, d3.max(csvdata, d => d.obesity)])
      .range([height, 0]);
   let bottomAxis = d3.axisBottom(xLinearScale);
   let leftAxis = d3.axisLeft(yLinearScale);
   chartGroup.append("g")
     .attr("transform", `translate(0, ${height})`)
     .call(bottomAxis);
   chartGroup.append("g")
     .call(leftAxis);  

  let circlesGroup = chartGroup.selectAll("circle")
    .data(csvdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".5");  

  chartGroup.selectAll()
    .data(csvdata)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "12px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

     // append x axis
   // Create group for x- axis labels
  let xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
      let povertyLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("value", "poverty") // value to grab for event listener
      .classed("axis-text", true)
      .text("In Poverty (%)");

      // let ageLabel = xLabelsGroup.append("text")
      // .attr("x", 0)
      // .attr("y", 40)
      // .attr("value", "age") // value to grab for event listener
      // .classed("axis-text", true)
      // .text("Age (Median)");

      // let incomeLabel = xLabelsGroup.append("text")
      // .attr("x", 0)
      // .attr("y", 60)
      // .attr("value", "income") // value to grab for event listener
      // .classed("axis-text", true)
      // .text("Household Income (Median)");

    // append y axis

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obesity (%)");
}); 