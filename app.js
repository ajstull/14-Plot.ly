// Function that populates the metadata, my belly button always smells, very interesting
function demoInfo(sample)
{

    // Use d3 in order to get the data
    d3.json("samples.json").then((data) => {
        // Grab all of the metadata
        let metaData = data.metadata

        // Filler based on the valie of sample, should return 1 result array based on dataset
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        
        // Acess index 0 from the array
        let resultData = result[0];

        // Clear the HTML/metadata out
        d3.select("#sample-metadata").html(""); 

        // Use object.entries to get value key pairs
        Object.entries(resultData).forEach(([key, value]) =>{
            
            // Add to the sample data section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        })
    });
}

// Function that builds the bar chart
function buildBarChart(sample)
{

    d3.json("samples.json").then((data) => {
        // Grab all of the metadata
        let sampleData = data.samples
    
        // Filler based on the valie of the sample, should return 1 result array based on dataset
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
    
        // Acess index 0 from the array
        let resultData = result[0];

        // Get the 'otu_ids', 'otu_labels' and 'sample_values'
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        

    
        // Build out the bar chart
        
        // Get the y-Ticks
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0, 10);
        let textLabels = otu_labels.slice(0, 10);

        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);
    });
}

// Function that builds out the bubble chart
function buildBubbleChart(sample)
{
    d3.json("samples.json").then((data) => {
        // Grab all of the metadata
        let sampleData = data.samples

        // Filler based on the valie of the sample, should return 1 result array based on dataset
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // Access index 0 from the array
        let resultData = result[0];

        // Get the 'otu_ids', 'otu_labels' and 'sample_values'
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // Build the bubble chart
        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        let layout = {
            title: "Bacteria Cultures per Sanple",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);
    });
}


// Function that initializes the dashboard
function initialize()
{

    let data = d3.json("samples.json");
    
    // Access the dropdown selector form the index.html file
    var select = d3.select("#selDataset");

    // Use d3 in order to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names; 

        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });

        // When initiaized, pass in the information for the first sample
        let sample1 = sampleNames[0];

        // Call the function to build the metadata
        demoInfo(sample1);
        
        // Call the function to build the bar chart
        buildBarChart(sample1);
        
        // Call the funciton to build the bubble chart
        buildBubbleChart(sample1);
    });

    
}

// Function that updates the dashboard
function optionChanged(item)
{
    // Call to update the metadata
    demoInfo(item);

    // Call the function to build the bar chart
    buildBarChart(item);

    // Call the function to build the bubble chart
    buildBubbleChart(item);
}

// Call the initialize function
initialize();