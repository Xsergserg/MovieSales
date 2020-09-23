let xhr = new XMLHttpRequest();
xhr.open(
	"GET",
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
	false
);
xhr.send();
const SVGwidth = 1400;
const SVGheight = 600;
const leftPadding = 75;
const rightPadding = 40;
const topPadding = 0;
const bottomPadding = 0;
const textPadding = 3;
const topTextPadding = 10;
const cellColor = {
	Action: "rgb(126, 17, 14)",
	Drama: "rgb(228, 97, 92)",
	Adventure: "green",
	Family: "rgb(23, 37, 167)",
	Animation: "rgb(192, 14, 183)",
	Comedy: "rgb(192, 136, 14)",
	Biography: "rgb(78, 68, 48)"
};

let tooltip = d3
	.select("body")
	.append("div")
	.attr("id", "tooltip")
	.style("opacity", 0);
function tooltipInfo(data) {
	let tooltip = "";
	dataArray = [...Object.entries(data)];
	dataArray.forEach(item => {
		tooltip +=	"<p class='tooltipText'>" + item[0] + ": " + item[1] + "</p>";
	});
	return tooltip;
} 

svg = d3
	.select(".container")
	.append("svg")
	.attr("width", SVGwidth)
	.attr("height", SVGheight)
	.append("g")
	.attr("transform", "translate(" + leftPadding + "," + topPadding + ")");

let dataset = JSON.parse(xhr.responseText);

document.getElementById("title").innerHTML = 'Top Most Sold Movies Grouped by Category'
document.getElementById("description").innerHTML = 'Movie Sales'

var root = d3.hierarchy(dataset).sum(function(d) {
	return +d.value;
});

console.log(root);

d3
	.treemap()
	.size([
		SVGwidth - (leftPadding + rightPadding),
		SVGheight - (topPadding + bottomPadding)
	])
	.padding(2)(root);

let cell = svg
	.selectAll("g")
	.data(root.leaves())
	.enter()
	.append("g")
	.attr("class", "group")
	.attr("transform", function(d) {
		return "translate(" + d.x0 + "," + d.y0 + ")";
	})
	.on("mouseover", d => {
		tooltip
			.transition()
			.duration(200)
			.style("opacity", 0.9);
		tooltip
			.html(tooltipInfo(d.data))
			.style("left", d3.event.pageX + 10 + "px")
			.style("top", d3.event.pageY - 25 + "px");
		tooltip.attr("data-value", d.data.value);
	})
	.on("mouseout", () => tooltip.style("opacity", 0)); 

cell.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", function(d) {
		return d.x1 - d.x0;
	})
	.attr("height", function(d) {
		return d.y1 - d.y0;
	})
	.attr("class", "tile")
	.attr("data-name", d => d.data.name)
	.attr("data-category", d => d.data.category)
	.attr("data-value", d => d.data.value)
	.style("stroke", "black")
	.style("fill", d => cellColor[d.data.category]);

cell.append("text")
	.attr("class", "textDescription")
	.selectAll("tspan")
	.data(function(d) {
		return d.data.name.split(/(?=[A-Z][^A-Z])/g);
	})
	.enter()
	.append("tspan")
	.attr("x", 3)
	.attr("y", function(d, i) {
		return 15 + i * 10;
	})
	.text(function(d) {
		return d;
	})


const legendHeight = 120;
const legendWidth = 300;
const legendBarSide = 12;

svg2 = d3
	.select(".container")
	.append("svg")
	.attr("width", legendWidth)
	.attr("height", legendHeight)
	.attr("id", "legend");
let legend = svg2
	.selectAll('g')
	.data([...Object.entries(cellColor)])
	.enter()
	.append("g")
	.attr("transform", "translate(0, 0)");

legend.append("rect")
	.attr("x", 0)
	.attr("y", (d, i) => i * 14+10)
	.attr("width", legendBarSide)
	.attr("height", legendBarSide)
	.attr("fill", d => d[1])
	.attr('class', 'legend-item')

legend.append("text")
.attr("x", legendBarSide+3)
.attr("y", (d, i) => i * 14 + 22)
.attr('class', 'legend-text')
.text(d=>d[0]);
