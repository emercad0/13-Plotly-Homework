function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    var sample = d3.select("#selDataset").property("value");
    var panel = d3.select("#sample-metadata");

    d3.json(`/metadata/${sample}`).then(function (data) {
      console.log(data);

    // Use `.html("") to clear any existing metadata
      panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    panel.selectAll("h6")
          .data(Object.entries(data))
          .enter()
          .append("h6")
          .text(function (data) {
            return `${data[0]} : ${data[1]}`});
    console.log(data);
        
    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
  });

    
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sample = d3.select("#selDataset").property("value");
     d3.json(`/samples/${sample}`).then(function (data){
           var otu_ids = data.otu_ids;
           var otu_labels = data.otu_labels;
           var sample_values = data.sample_values;

    // @TODO: Build a Bubble Chart using the sample data
       var builtLayout = {
        margin: {t: 0},
        hoverinfo: "percent+text+label+value",
        xaxis: {title: "OTU ID"}
       };
       var bubbleData = [{
         x: otu_ids, y: sample_values,
         text: otu_labels,
         mode: "markers",
         marker: { size: sample_values,
          color: otu_ids,
          colorscale: "Greys"
         }}];

       Plotly.newPlot("bubble", bubbleData, builtLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

     var pieLayout = {
       margin: {l: 0.5, r: 10, b: 10, t: 0.5, pad: 5}
     };

    var pieData = [{
      values: sample_values.slice(0, 10),
      labels: otu_ids.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      hoverinfo: "label+text+value+percent",
      textinfo: "percent",
      type: "pie"
    }];

    Plotly.newPlot("pie", pieData, pieLayout);


      });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
    d3.json("/names").then(function (samples){
    selector.selectAll("option").data(samples)
    .enter()
    .append("option")
    .text(function (d) 
    {
      return d; 
    })
    .property("value", function (d) 
    {
      return d; 
    })
    console.log(samples[0]);
  });
  

  // Use the first sample from the list to build the initial plots
  //const firstSample = samples[0]
    const firstSample = selector.property("value");
    buildCharts(firstSample);
    buildMetadata(firstSample);
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
 
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


