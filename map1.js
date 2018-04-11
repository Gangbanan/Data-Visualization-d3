// reference: https://bl.ocks.org/bricedev/97c53d6ed168902239f7


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var preYear = 1851


// temperatur ranges from 5 to 14

var value2color = d3.scale.threshold()
    .domain([5, 6.5, 8, 9.5, 11 , 12.5, 14])
    .range(["#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#deebf7"]);

var colorx = d3.scale.linear()
        .domain([4, 15])
        .range([0, 300]);

// // rainfall   ranges from 1.5 to 6
// var value2color = d3.scale.threshold()
//     .domain([2, 2.5, 3, 3.5, 4, 4.5, 5])
//     .range(["#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#deebf7"]);

// var x = d3.scale.linear()
//         .domain([1.5, 6])
//         .range([0, 300]); 


var formatNumber = d3.format("s");

var colorAxis = d3.svg.axis()
    .scale(colorx)
    .orient("bottom")
    .tickSize(13)
    .tickValues(value2color.domain())
    .tickFormat(function(d) { return formatNumber(d); });

// add the graph canvas to the body of the webpage
var chartSvg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

var g = chartSvg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(" + 40 + "," + 40 + ")");

g.selectAll("rect")
    .data(value2color.range().map(function(currentColor) {
      var d = value2color.invertExtent(currentColor);
      if (d[0] == null) d[0] = colorx.domain()[0];
      if (d[1] == null) d[1] = colorx.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return colorx(d[0]); })
    .attr("width", function(d) { return colorx(d[1]) - colorx(d[0]); })
    .style("fill", function(d) { return value2color(d[0]); });

g.call(colorAxis)
    .append("text")
    .attr("y", -6)
    .text("Temperature");

// load data  data/oh-albers-color.ndjson
// 1851-2014
d3.json("data/oh-temp.json", function(error,tempData) {
    
// load data  data/oh-albers-color.ndjson
d3.json("data/oh-albers-density.json", function(error, ohio) {
    // if data is topojson
    // var ohio = ohio.feature(ohio, ohio.objects.counties);

    var projection = d3.geoEquirectangular()
                .fitExtent([[margin.left, margin.top], [width, height]], ohio);
    var posMap = ['latitude', 'longitude'];
    var posScreen = projection(posMap);
    var geoGenerator = d3.geoPath()
                    .projection(projection);

    chartSvg.append("g")
        .attr("class", "picture")
        .attr("transform", "translate(" + 40 + "," + 40 + ")")
        .selectAll('path')
        .data(ohio.features)
        .enter()
        .append("path")
        .attr("class", "region")
        .attr("d", geoGenerator)
        .style("fill", function(d,i) {
            year = document.getElementById("numDots").value;
            yearData = tempData["" + year]
            return value2color(yearData[d['id']]);
        })
        .style("stroke", "#000")
        .style("stroke-width", "0.5px");


});

  document.getElementById("numDots").addEventListener('change', function(){
      year = document.getElementById("numDots").value;
      chartSvg.selectAll('path')
      .transition().duration(1000)
      .style("fill",function(d,i){

          // tempData['year'][d['id']] for temperature in this polygon in this year
          yearData = tempData["" + year]
          return value2color(yearData[d['id']]);
      })
  });

});

