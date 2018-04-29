// reference: https://bl.ocks.org/bricedev/97c53d6ed168902239f7


var margin = {top: 20, right: 0, bottom: 0, left: 20},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
var preYear = 1851
var dur = 200,
    outOpacity = 0.1;
var mapWidth = 540,
    mapHeight = 450;

// temperature ranges from 5 to 14

// var value2color = d3.scale.threshold()
//     .domain([5, 6.5, 8, 9.5, 11 , 12.5, 14])
//     .range(["#1230FC", "#448CFF", "#CCDCFF", "#FFFF86", "#FFFF20", "#FD8308", "#FA3407", "#F10006"]);
//     // .range(["#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#deebf7"])

// define color scale and axis stick
var axisDomain = [2, 2.5, 3, 3.5, 4, 4.5, 5];
var linearDomain = axisDomain;
var value2color = d3.scale.linear()
                  .domain(linearDomain)
                  .range(["#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]);

var colorx = d3.scale.linear()
        .domain([1.5, 6])
        .range([0, 300]);

var formatNumber = d3.format("s");
function _f(d){
  var mutiCoef = 5
  var x = +d3.format(".0f")(d*mutiCoef);
  return x/mutiCoef;
}

// draw axis stick
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


// add axis color using linearGradient
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

// 1851-2014
d3.json("data/oh-precip.json", function(error,tempData) {
    
d3.json("data/oh-albers-density.json", function(error, ohio) {
    // if data is topojson
    // var ohio = ohio.feature(ohio, ohio.objects.counties);

    // define geo data generator
    var projection = d3.geoEquirectangular()
                .fitExtent([[margin.left, margin.top], [margin.left + mapWidth, margin.top + mapHeight]], ohio);
    var geoGenerator = d3.geoPath()
                    .projection(projection);

    var pictureG = chartSvg.append("g")
        .attr("class", "picture")
        .attr("transform", "translate(" + (0) + "," + 0 + ")")

    // drawing map and color for it
    pictureG.selectAll('path')
        .data(ohio.features)
        .enter()
        .append("path")
        .attr("class", "region")
        .attr("d", geoGenerator)
        .attr("id", function(d,i){ return d['id'];})
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
        .style("stroke-width", "1px");

    // centerCord is pick one cordinate as its representive 
    // cordinate for later testing if it is in the selected rect
    var centerCord = {}
    ohio.features.forEach(function(d,i) {
        if (d.geometry.type == "Polygon") {
            centerCord[d["id"]] = projection(d.geometry.coordinates[0][0]);
        } else if (d.geometry.type == "MultiPolygon") {
            centerCord[d["id"]] = projection(d.geometry.coordinates[0][0][0]);
        }
        
    })

    // deal with draging and showing the rect selected with mouse move
    // when detecting mousedown, display the rect by changing opacity
    //                mousemove, change width, height and transform
    //                mouseup, hide the rect and hide outside path
    //                         call redrawing the line chart
    var selectrect = chartSvg.append("rect")
    var mouseStopId;
    var mouseOn = false;
    var startX = 0;
    var startY = 0;
    var idset = [];
    chartSvg.on("mousedown", function () {

        mouseOn = true;
        var mousePos = d3.mouse(this)
        startX = mousePos[0];
        startY = mousePos[1];
        selectrect.attr("transform", "translate(" + startX + "," + startY + ")")
            .style("fill", "#aaa")
            .style("opacity", 0.6);
        idset = [];
    })
    .on("mousemove", function() {
        if (mouseOn) {
            var mousePos = d3.mouse(this)

            selectrect.attr("transform", "translate(" + d3.min([mousePos[0], startX]) + "," + d3.min([mousePos[1], startY]) + ")")
                .attr("width", d3.max([mousePos[0], startX]) - d3.min([mousePos[0], startX]))
                .attr("height", d3.max([mousePos[1], startY]) - d3.min([mousePos[1], startY]));
        }
    })
    .on("mouseup", function() {
        if (mouseOn) {
            mouseOn = false;
            selectrect.style("opacity", 0)
                .attr("width", 0)
                .attr("height", 0);
            var mousePos = d3.mouse(this)
            var minX = d3.min([mousePos[0], startX]),
                maxX = d3.max([mousePos[0], startX]),
                minY = d3.min([mousePos[1], startY]),
                maxY = d3.max([mousePos[1], startY]);
            pictureG.selectAll('path')
            .style("opacity", function(d,i) {
                nowid = d3.select(this).attr('id');
                if (centerCord[nowid][0] < minX || centerCord[nowid][0] > maxX) return outOpacity;
                if (centerCord[nowid][1] < minY || centerCord[nowid][1] > maxY) return outOpacity;
                idset.push(nowid)
                return 1;
            })
            .style("stroke", "black")
            .style("stroke-width", "0.2px");

            avgTemp = {}; // {year: temp, ...}
            idset.forEach(function(d,i) {
                Object.keys(tempData).forEach(function(dd) {
                    // dd is year
                    if (!avgTemp.hasOwnProperty(dd)) avgTemp[dd] = 0;
                    avgTemp[dd] += tempData[dd][d];
                })
            })
            Object.keys(avgTemp).forEach(function(key) { avgTemp[key] = avgTemp[key]*1.0/idset.length})
            console.log(avgTemp)
            draw_temp(avgTemp)
        }
    })
    


});
    // add change listener for input
    document.getElementById("numDots").addEventListener('change', function(){
        year = document.getElementById("numDots").value;
        year = +year;
        var ttYear = 0;
        function _changeColor(nowYear) {
            chartSvg.selectAll('path')
            .transition()
            .duration(dur)
            .style("fill",function(d,i){
                // tempData['year'][d['id']] for temperature in this polygon in this year
                rectData = _f(tempData["" + nowYear][d['id']])
                return value2color(rectData);
            })
            .style("stroke",function(d,i){

                // tempData['year'][d['id']] for temperature in this polygon in this year
                rectData = _f(tempData["" + nowYear][d['id']])
                return value2color(rectData);
            })
        }
        function changeColor(nowYear) {
            return function() { _changeColor(nowYear); }
        }
        while (year != preYear) {
            if (year > preYear) preYear += 1;
            if (year < preYear) preYear -= 1;
            setTimeout(changeColor(preYear), dur*ttYear);
            ttYear += 1;
        }
    });

});



