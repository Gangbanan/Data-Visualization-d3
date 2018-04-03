var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// load data  data/oh-albers-color.ndjson
d3.json("data/oh-albers-density.json", function(error, ohio) {
    console.log(ohio)
    // if data is topojson
    // var ohio = ohio.feature(ohio, ohio.objects.counties);

    var projection = d3.geoEquirectangular()
                .fitExtent([[margin.left, margin.top], [width, height]], ohio);
    var posMap = ['latitude', 'longitude'];
    var posScreen = projection(posMap);
    var geoGenerator = d3.geoPath()
                    .projection(projection);
    // var ohioPath = svg.append('path')
    //                 .attr('d', geoGenerator(ohio))
    //                 .attr('fill', function(d,i) {
    //                   if (i < 20) {return 'white';}
    //                     else {return 'purple';}
    //                 })
    //                 .attr('stroke', "#000000")
    //                 .attr('stroke-width', 0.5)
    svg.selectAll()
      .data(ohio.features)
      .enter()
      .append("path")
      .attr("class", "region")
      .attr("d", geoGenerator)
      .style("fill", function(d,i) {
        if (d['properties']['density'] < 2000) return 'white';
        return '#aca'; 
      })
      .style("stroke", "#000")
      .style("stroke-width", "0.5px")




});

