var margin = {top: 50, right: 50, bottom: 50, left: 50};
var width  = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

x.domain([1200, 3100]);
y.domain([0, 1]);

var svg = d3.select("#line-graph")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
var line = d3.line()
  .x(function(d) { return x(d.elo); })
  .y(function(d) { return y(d.castle); });

var div = d3.select("main").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));
  
svg.append("text")             
  .attr("transform",
    "translate(" + (width/2) + " ," + (height + 40) + ")")
  .style("text-anchor", "middle")
  .text("Player Elo Rating");

svg.append("g")
  .call(d3.axisLeft(y));
 
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Probability of Castling");  
  
d3.csv("white_castle.csv",
  function(data) {
    return { elo: parseInt(data.elo), castle: parseFloat(data.castle) };
  },
  function(error, data) {
    if (error) throw error;
    svg.append("path")
      .data([data])
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "lightblue")
      .attr("stroke-width", "4px");
        // Add the scatterplot
    svg.selectAll("dot")	
      .data(data)			
      .enter()
      .append("circle")		
      .attr("fill", "lightblue")      
      .attr("r", 6)		
      .attr("cx", function(d) { return x(d.elo); })		 
      .attr("cy", function(d) { return y(d.castle); })		
      .on("mouseover", function(d) {		
        div.transition()		
          .duration(200)		
          .style("opacity", .9)
          .style("background", "lightblue");
        div.html("Elo: " + d.elo + "<br/>"  + "Probability: " + d.castle)	
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })					
      .on("mouseout", function(d) {		
        div.transition()		
          .duration(500)		
          .style("opacity", 0);	
      });
  }
);

d3.csv("black_castle.csv",
  function(data) {
    return { elo: parseInt(data.elo), castle: parseFloat(data.castle) };
  },
  function(error, data) {
    if (error) throw error;
    svg.append("path")
      .data([data])
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "darkred")
      .attr("stroke-width", "4px");
    svg.selectAll("dot")	
      .data(data)			
      .enter()
      .append("circle")		
      .attr("fill", "darkred")      
      .attr("r", 6)		
      .attr("cx", function(d) { return x(d.elo); })		 
      .attr("cy", function(d) { return y(d.castle); })		
      .on("mouseover", function(d) {		
        div.transition()		
          .duration(200)		
          .style("opacity", .9)
          .style("background", "pink");
        div.html("Elo: " + d.elo + "<br/>"  + "Probability: " + d.castle)	
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })					
      .on("mouseout", function(d) {		
        div.transition()		
          .duration(500)		
          .style("opacity", 0);	
      });
  }
);

svg.append("text")
  .text("Players with low elo castle around 51% of games.")
  .attr("font-size", 12)
  .attr("y", 30)
  .attr("x", 20);

svg.append("line")
  .attr("x1", "60")
  .attr("y1", "40")
  .attr("x2", "10")
  .attr("y2", "180")
  .attr("stroke", "black")
  .attr("stroke-width", 2);

svg.append("text")
  .text("Players with high elo castle around 97% of games.")
  .attr("font-size", 12)
  .attr("y", 100)
  .attr("x", 600);

svg.append("line")
  .attr("x1", "860")
  .attr("y1", "30")
  .attr("x2", "840")
  .attr("y2", "80")
  .attr("stroke", "black")
  .attr("stroke-width", 2);