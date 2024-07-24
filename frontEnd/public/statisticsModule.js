// import * as d3 from "https://d3js.org/d3.v6.min.js";

export async function fetchItems(groupByOption) {
    try {
        const response = await fetch(`http://localhost:3000/items/group-by-dynamic?groupBy=${groupByOption}`);
        const items = await response.json();
        console.log('Fetched items:', items);
        displayItems(items);
        renderGraphs(items);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

export function displayItems(items) {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.textContent = `${item._id} - Number of Items: ${item.totalItems}`;
        itemList.appendChild(itemDiv);
    });

    if (items.length === 0) {
        const noResults = document.createElement('div');
        noResults.textContent = 'No items found.';
        itemList.appendChild(noResults);
    }
}

// Render graphs based on items data
export function renderGraphs(items) {
    console.log('Rendering graphs with items:', items);

    const categories = items.map(item => item._id);
    const totalItems = items.map(item => item.totalItems);

    // Clear previous graphs
    d3.select("#graph1").selectAll("*").remove();
    d3.select("#graph2").selectAll("*").remove();

    // Graph 1: Bar chart for item totalItems
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Create the SVG container and set the origin
    const svg1 = d3.select("#graph1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3.scaleBand()
        .domain(categories)
        .range([0, width])
        .padding(0.1);

    // Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(totalItems)])
        .nice()
        .range([height, 0]);

    // Add X axis
    svg1.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    svg1.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg1.selectAll(".bar")
        .data(items)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d._id))
        .attr("y", d => y(d.totalItems))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.totalItems))
        .attr("fill", "steelblue");

    // Add labels
    svg1.selectAll(".label")
        .data(items)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d._id) + x.bandwidth() / 2)
        .attr("y", d => y(d.totalItems) - 5)
        .attr("text-anchor", "middle")
        .text(d => `${d.totalItems}`);

    // Graph 2: Pie chart for selected category distribution
    const pieData = items.map(item => ({
        category: item._id,
        count: item.totalItems
    }));

    const svg2 = d3.select("#graph2")
        .append("svg")
        .attr("width", 600)
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(300,200)");

    const radius = Math.min(600, 400) / 2;

    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Define color scheme
    const colorScheme = [
        '#0E1B3D',
        '#263451', 
        '#3F4D65', 
        '#576779',
        '#6F808D',
        '#8899A1',
        '#A0B2B5',
    ];

    const arcs = svg2.selectAll("arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => colorScheme[i % colorScheme.length]);

    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(d => `${d.data.category} (${d.data.count})`);
}