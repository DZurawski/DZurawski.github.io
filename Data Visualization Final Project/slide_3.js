var round = function(x) {
  return Math.round(x * 1000) / 1000;
}

var margin = {top: 50, right: 50, bottom: 50, left: 50};
var width  = 600 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var itemSize = 24;
var cellSize = itemSize - 1;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var svg = d3.select("#heat-map")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("main").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);
  
d3.csv("moves_before_castle.csv",
  function(data) {
    return {
      wm: Math.floor(parseFloat(data.wm)),
      bm: Math.floor(parseFloat(data.bm)),
      wloss: parseFloat(data.wloss),
      wdraw: parseFloat(data.wdraw),
      wwin: parseFloat(data.wwin),         
      wavg: parseFloat(data.wavg),
      bloss: round(1 - parseFloat(data.wloss) - parseFloat(data.wdraw)),   
      bdraw: parseFloat(data.wdraw),
      bwin: round(1 - parseFloat(data.wwin) - parseFloat(data.wdraw)),
      bavg: round(1 - parseFloat(data.wavg))
    };
  },
  function (error, data) {
    if (error) throw error;
    
    x.domain(d3.extent(data, function(d) { return d.wm; }));
    y.domain(d3.extent(data, function(d) { return d.bm; }));
   
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    
    svg.append("g")
      .call(d3.axisLeft(y));
    
    var colorScale = d3.scaleThreshold()
      .domain([0.40, 0.42, 0.44, 0.46, 0.48, 0.50, 0.52, 0.54, 0.56, 0.58, 0.60])
      .range([d3.hsl(0, 1, 0.3), d3.hsl(0, 1, 0.4), d3.hsl(0, 1, 0.5),
              d3.hsl(0, 1, 0.6), d3.hsl(0, 1, 0.7), d3.hsl(240, 1, 0.7),
              d3.hsl(240, 1, 0.6), d3.hsl(240, 1, 0.5), d3.hsl(240, 1, 0.4),
              d3.hsl(240, 1, 0.3)]);
    
    var cells = svg.selectAll('rect')
      .data(data)
      .enter()
      .append('g')
      .append('rect')
      .attr('class', 'cell')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('x', function(d) { return x(d.wm) + 2; })
      .attr('y', function(d) { return y(d.bm) - itemSize; })
      .attr('fill', function(d) { return colorScale(d.wavg); })
      .on("mouseover", function(d) {		
        div.transition()		
          .duration(200)		
          .style("opacity", 1)
          .style("background", "lightgray")
          .style("width", "240px")
          .style("height", "7.5em");
        div.html(
          "White Moves Before Castle: " + d.wm
          + "<br/>Black Moves Before Castle: " + d.bm
          + "<br/>White Average Score: " + d.wavg
          + "<br/>Probability White Wins: " + d.wwin
          + "<br/>Probability Black Wins: " + d.bwin
          + "<br/>Probability of Draw: " + d.wdraw
        )	
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");
      })					
      .on("mouseout", function(d) {		
        div.transition()		
          .duration(500)		
          .style("opacity", 0);	
      });
  
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Moves Before Black Castles");  
    
    svg.append("text")             
      .attr("transform",
        "translate(" + (width/2) + " ," + (height + 40) + ")")
      .style("text-anchor", "middle")
      .text("Number of Moves Before White Castles");
  }
);

svg.append("text")
  .text("Players who castle against an opponent who does not castle tend to score higher.")
  .attr("font-size", 12)
  .attr("y", 325)
  .attr("x", 50);

svg.append("line")
  .attr("x1", "200")
  .attr("y1", "330")
  .attr("x2", "300")
  .attr("y2", "365")
  .attr("stroke", "black")
  .attr("stroke-width", 2);
  
svg.append("line")
  .attr("x1", "100")
  .attr("y1", "310")
  .attr("x2", "40")
  .attr("y2", "150")
  .attr("stroke", "black")
  .attr("stroke-width", 2);
