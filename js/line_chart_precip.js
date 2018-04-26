
// Set the dimensions of the canvas / graph
var linemg = {top: 10, right: 20, bottom: 10, left: 20},
    width = 950 - linemg.left - linemg.right,
    height = 180 - linemg.top - linemg.bottom;
var linepreYear = 1851;

var linexScale = d3.scale.linear()
                    .range([0, width]);

var lineyScale = d3.scale.linear()
                    .range([height, 0]);
// Define x axis
var x = d3.time.scale().range([0, width]);

var xScale =  d3.scaleTime() 
    .domain([new Date(1851, 0, 1), new Date(2014, 0, 1, 0)]) 
    .rangeRound([0,width]);

var xAxis = d3.svg.axis()
    .scale(xScale) 
    .tickSize(1) 
    .tickFormat(d3.timeFormat("%Y")); 

// Define the line
var valueline = d3.line()
    .x(function(d) { return linexScale(d.time); })
    .y(function(d) { return lineyScale(d.temp); });

// // Define for tooltip
// var tooltip = d3.select("body").append("div")	
//     .attr("class", "tooltip")				
//     .style("opacity", 0);

// Adds the svg canvas
var svg = d3.select("#linechart")
    .append("svg")
        .attr("width", width + linemg.left + linemg.right)
        .attr("height", height + linemg.top + linemg.bottom)
    .append("g")
        .attr("transform", "translate(" + linemg.left + "," + linemg.top + ")");

var text_year = d3.select("#displaybox_year")
var text_data = d3.select("#displaybox_data")

d3.select("#numDots")
    .attr("width", width + linemg.left + linemg.right)
    .attr("transform", "translate(" + linemg.left + "," + 0 + ")");

// Get the data
d3.csv("data/precip-ts.csv", function(error, data) {
    data.forEach(function(d) {
        d.time = +d.time;
        d.temp = +d.temp;
        //console.log(d["time"]);
    });

    var dataDict = {};
    data.forEach(function(d) {
        dataDict[d.time] = d.temp;
    });
    console.log(dataDict)
    // Scale the range of the data
    linexScale.domain(d3.extent(data, function(d) { return d.time; }));
    lineyScale.domain(d3.extent(data, function(d) { return d.temp; }));

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // // Add x axis
    // svg.append("g") 
    //     .attr("class", "x axis") 
    //     .attr("transform", "translate(0,"+height/3+")") 
    //     .call(xAxis); 

    svg.append("circle")
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) {
            year = document.getElementById("numDots").value;
            return linexScale(year);
        })
        .attr("cy", function(d) {
            year = document.getElementById("numDots").value;
            return lineyScale(dataDict[year]);
        })
        .attr("r", 5);
        // // tooltip
        // .on("mouseover", function(d) {
        //     year = document.getElementById("numDots").value;
        //     tooltip.transition()
        //         .duration(20)
        //         .style("opacity", .9);
        //     tooltip.html(year + "<br/>"  + dataDict[year])
        //         .style("left", d3.event.pageX + "px")
        //         .style("top", d3.event.pageY+500 + "px");
        //     })
        // .on("mouseout", function(d) {
        //     tooltip.transition()
        //         .duration(50)
        //         .style("opacity", 0);
        // });

    text_year.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", ".35em")
        .text(function(d) {
            year = document.getElementById("numDots").value;
            return "Year: " + year;
        });

    text_data.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", ".35em")
        .text(function(d) {
            year = document.getElementById("numDots").value;
            return "Precipitation: "  + dataDict[year];
        });

    document.getElementById("numDots").addEventListener('change', function(){
        year = document.getElementById("numDots").value;
        year = +year;
        console.log(year);
        dur = 200;
        var ttYear = 0;
        while (year != linepreYear) {
            if (year > linepreYear) linepreYear += 1;
            if (year < linepreYear) linepreYear -= 1;
            console.log(ttYear)
            svg.select("circle")
                .transition()
                .delay(dur*ttYear)
                .duration(dur)
                .attr("cx", function(d) {
                return linexScale(linepreYear);
                })
                .attr("cy", function(d) {
                    return lineyScale(dataDict[linepreYear]);
                })

            text_year.select("text")
                .transition()
                .delay(dur*ttYear)
                .text(function(d) {
                    return "Year: " + linepreYear;
                })
            
            text_data.select("text")
                .transition()
                .delay(dur*ttYear)
                .text(function(d) {
                    return "Temperature: "  + dataDict[linepreYear];
                })
            ttYear += 1;
        }
    });
      
});