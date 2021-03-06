// loader settings
let opts = {
	lines: 5, // The number of lines to draw
	length: 10, // The length of each line
	width: 10, // The line thickness
	radius: 14, // The radius of the inner circle
	color: 'lime', // #rgb or #rrggbb or array of colors
	speed: 1.9, // Rounds per second
	trail: 40, // Afterglow percentage
	className: 'spinner', // The CSS class to assign to the spinner
  };

whenDocumentLoaded(() => {
	// Initialize dashboard
	is2050 = false;
	colorSchema = {UN: [d3.hcl(100, 90, 100),d3.hcl(15, 90, 60)], pop: [d3.hcl(227,5,98),d3.hcl(254,45,23)], NC: [d3.hcl(119,22,93),d3.hcl(133,34,25)]};
	plot_object = new MapPlot('globe-plot');
	charts = {distribution: new DistributionChart(), scenario: new SuperScenarioChart(), population: new SuperPopulationChart()};
	
	// When the dataset radio buttons are changed: change the dataset
	d3.selectAll(("input[name='radio1']")).on("change", function(){
		plot_object.setDataset(this.value)
	});
	
	d3.selectAll(("input[name='radio2']")).on("change", function(){
		plot_object.setScenario(this.value)
	});

	showledgend(colorSchema['UN']);
});


function switchMode(mode){
	plot_object.setMode(mode);
	const elements = document.getElementsByClassName('mode-button');
	for (let i = 0; i < elements.length; i++) {
		elements[i].classList.remove('selected');
	}
	document.getElementById(mode + '-button').classList.add('selected');
	
	showledgend(colorSchema[mode]);
	updateLabels(plot_object.currentDatasetName,mode);
}


// Year toggle
function switchYear(toggle) {
	is2050 = toggle;
	let scenarioRow = document.getElementById('scenario');
	if (is2050) {
		scenarioRow.style.opacity = '1';
		scenarioRow.style.transition = 'opacity 0.5s linear';
		scenarioRow.style.visibility = 'visible';
		document.querySelector("input[name='radio2']:checked").dispatchEvent(new Event('change'));
		document.getElementById('year-button-2015').classList.remove('selected');
		document.getElementById('year-button-2050').classList.add('selected');
	} else {
		scenarioRow.style.visibility = 'collapse';
		scenarioRow.style.opacity = '0';
		scenarioRow.style.transition = 'opacity 0.5s linear';
		scenarioRow.style.transition = 'visibility 0.15s linear';
		plot_object.setScenario("c");
		document.getElementById('compare-scenarios').style.visibility = 'hidden';
		document.getElementById('year-button-2015').classList.add('selected');
		document.getElementById('year-button-2050').classList.remove('selected');
    }
};

function showledgend(color){
	const w = 150, h = 25;
	d3.selectAll(".legend")
		.remove()
		.exit()
	d3.selectAll("#gradient")
		.remove()
		.exit()

	let key = d3.select("#legendBar")
		.attr("width", w)
		.attr("height", h);

	let legend = key.append("defs")
		.append("svg:linearGradient")
		.attr("id", "gradient")
		.attr("x1", "0%")
		.attr("y1", "100%")
		.attr("x2", "100%")
		.attr("y2", "100%")
		.attr("spreadMethod", "pad");

	legend.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", color[0])
		.attr("stop-opacity", 1);

	legend.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", color[1])
		.attr("stop-opacity", 1);

	key.append("rect")
		.attr("class", "legend")
		.attr("width", w)
		.attr("height", h)
		.style("fill", "url(#gradient)");	
}
function updateLabels(dataset,mode){
	const labels = {UN: {ndr: "Nitrogen Export", poll: "Lost crop production", cv: "Coastal Hazard"},
					pop: {ndr: "Rural Population", poll: "Pollination-dependant Population", cv: "Coastal Population"},
					NC: {ndr: "Nitrogen Pollution Avoided", poll: "Pollination Need Met", cv: "Coastal Risk Reduction"}};
	document.getElementById('legendText-low').innerHTML = "Low <br>" + labels[mode][dataset];
	document.getElementById('legendText-high').innerHTML = "High <br>" + labels[mode][dataset];
	document.getElementById('distri-y-axis').innerHTML = labels['UN'][dataset];

}

function updateCountryName(name) {
	document.getElementById("countryLabel").innerHTML = name;
}

function updateCharts(focusedData, colorScale, allfocusedCountryData){
	if(focusedData == 0){
		hideCharts();
	}
	else{
		charts.distribution.show(focusedData, colorScale);
		if(is2050){
			charts.scenario.update(allfocusedCountryData);
			charts.population.update(allfocusedCountryData);
			document.getElementById('compare-scenarios').style.visibility = 'visible';
		}
	}
}

function hideCharts(){
	document.getElementById('distribution-chart').style.visibility = 'hidden';
	document.getElementById('compare-scenarios').style.visibility = 'hidden';
}


function backToGlobe(){
	plot_object.resetClick();
	document.getElementById('resetText').style.visibility = 'hidden';
	document.getElementById("countryLabel").style.visibility = 'hidden';
}

			
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}
