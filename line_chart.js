
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 10, bottom: 30, left: 10},
    width = 950 - margin.left - margin.right,
    height = 180 - margin.top - margin.bottom;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var xScale =  d3.scaleTime()
    .domain([new Date(1851, 0, 1), new Date(2014, 0, 1, 0)])
    .rangeRound([0,width - 0]);
var xAxis = d3.svg.axis()
    .scale(xScale)
    .tickSize(1)
    .tickFormat(d3.timeFormat("%Y"));

var y = d3.scale.linear().range([height, 0]),
    yScale = d3.scale.linear().range([width, 0]);
    // yAxis = d3.svg.axis().scale(yScale).orient("left");

// Define the line
var valueline = d3.line()
    .x(function(d) { return (1851-d.time)*5.7; })
    .y(function(d) { return d.temp*100; });
// Adds the svg canvas
var svg = d3.select("#linechart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("oh-temp.csv", function(error, data) {
    data.forEach(function(d) {
        d.time = +d.time;
        d.temp = +d.temp;
        //console.log(d["time"]);
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.temp; })]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("transform", "translate(930,-950)")
        .attr("d", valueline);

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    console.log(data[1]["temp"]);

    svg.append("circle")
        // .data(function(d) {
        //     year = document.getElementById("numDots").value;
        //     console.log(data[year-1850]);
        //     return data[year-1850];
        // })
        //.attr("transform", "translate(930,-950)")
    //   .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) {
            year = document.getElementById("numDots").value;
            console.log(data[year-1851]["time"]);
            x_val = (1851-data[year-1851]["time"])*5.7;
            return x_val;
        })
        .attr("cy", function(d) {
            year = document.getElementById("numDots").value;
            console.log(data[year-1851]["temp"]);
            y_val = data[year-1851]["temp"]*100 - 870;
            return y_val;
        })
        .attr("r", 5);

    document.getElementById("numDots").addEventListener('change', function(){
        year = document.getElementById("numDots").value;
        console.log(year);
    });
      
});