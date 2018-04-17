// reference: https://bl.ocks.org/bricedev/97c53d6ed168902239f7


var margin = {top: 20, right: 0, bottom: 0, left: 20},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
var preYear = 1851
var mapWidth = 360,
    mapHeight = 300;

// temperature ranges from 5 to 14

// var value2color = d3.scale.threshold()
//     .domain([5, 6.5, 8, 9.5, 11 , 12.5, 14])
//     .range(["#1230FC", "#448CFF", "#CCDCFF", "#FFFF86", "#FFFF20", "#FD8308", "#FA3407", "#F10006"]);
//     // .range(["#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#deebf7"])

// three color range
var axisDomain = [6, 7, 8, 9, 10, 11, 12, 13];
var linearDomain = [5, 8, 14];
var value2color = d3.scale.linear()
                  .domain(linearDomain)
                  .range(["#18517F", "#38A03F", "#EFB223"]);

var colorx = d3.scale.linear()
        .domain([5, 14])
        .range([0, 300]);

var formatNumber = d3.format("s");
function _f(d){
  var mutiCoef = 1.5
  var x = +d3.format(".0f")(d*mutiCoef);
  return x/mutiCoef;
}

var colorAxis = d3.svg.axis()
    .scale(colorx)
    .orient("right")
    .tickSize(13)
    .tickValues(axisDomain)
    .tickFormat(function(d) { return formatNumber(d); });

// add the graph canvas to the body of the webpage
var chartSvg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


// add axis
var defs = chartSvg.append("defs");
var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("transform", "translate(" + 40 + "," + 40 + ")");
linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

var clRg = value2color.range() // color range
var clDm = value2color.domain() // color domain
var _p2 = d3.format(".0%");

for (var i = 0; i < clRg.length; i++) {
    var pct = (clDm[i] - clDm[0]) / (clDm[clDm.length-1] - clDm[0]);
    linearGradient.append("stop").attr("offset", _p2(pct)).attr("stop-color", clRg[i]);
}

chartSvg.append("rect")
    .attr("width", 13)
    .attr("height", 300)
    .attr("transform", "translate(" + (margin.left+mapWidth+40) + "," + margin.top + ")")
    .style("fill", "url(#linear-gradient)");

// call axis
var g = chartSvg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(" + (margin.left+mapWidth+40) + "," + margin.top + ")");
g.call(colorAxis);

// load data  data/oh-albers-color.ndjson
// 1851-2014
d3.json("data/oh-temp.json", function(error,tempData) {
    
// load data  data/oh-albers-color.ndjson
d3.json("data/oh-albers-density.json", function(error, ohio) {
    // if data is topojson
    // var ohio = ohio.feature(ohio, ohio.objects.counties);

    var projection = d3.geoEquirectangular()
                .fitExtent([[margin.left, margin.top], [margin.left + mapWidth, margin.top + mapHeight]], ohio);
    var posMap = ['latitude', 'longitude'];
    var posScreen = projection(posMap);
    var geoGenerator = d3.geoPath()
                    .projection(projection);

    chartSvg.append("g")
        .attr("class", "picture")
        .attr("transform", "translate(" + (0) + "," + 0 + ")")
        .selectAll('path')
        .data(ohio.features)
        .enter()
        .append("path")
        .attr("class", "region")
        .attr("d", geoGenerator)
        .style("fill", function(d,i) {
            year = document.getElementById("numDots").value;
            rectData = _f(tempData["" + year][d['id']])
            return value2color(rectData);
        })
        .style("stroke", function(d,i) {
            year = document.getElementById("numDots").value;
            rectData = _f(tempData["" + year][d['id']])
            return value2color(rectData);
        })
        .style("stroke-width", "1px")


});

  document.getElementById("numDots").addEventListener('change', function(){
      year = document.getElementById("numDots").value;
      year = +year;
      var ttYear = 0;
      dur = 200;
      while (year != preYear) {
          if (year > preYear) preYear += 1;
          if (year < preYear) preYear -= 1;
          console.log(preYear)
          chartSvg.selectAll('path')
          .transition()
          .delay(dur*ttYear)
          .duration(dur)
          .style("fill",function(d,i){

              // tempData['year'][d['id']] for temperature in this polygon in this year
              rectData = _f(tempData["" + preYear][d['id']])
              return value2color(rectData);
          })
          .style("stroke",function(d,i){

              // tempData['year'][d['id']] for temperature in this polygon in this year
              rectData = _f(tempData["" + preYear][d['id']])
              return value2color(rectData);
          })
          ttYear += 1;
      }
    });

});

