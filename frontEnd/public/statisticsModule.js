import * as d3 from "https://d3js.org/d3.v6.min.js";

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

export function renderGraphs(items) {
    console.log('Rendering graphs with items:', items);

    // Validate and prepare data for graphs
    const validItems = items.filter(item => {
        return (
            typeof item.totalItems === "number" &&
            !isNaN(item.totalItems) &&
            typeof item.madeIn === "string" &&
            item.madeIn
        );
    });

    const validTotalItems = validItems.map(item => item.totalItems);
    const countries = validItems.map(item => item.madeIn);
    const itemNames = validItems.map(item => item._id);

    // Clear previous graphs
    d3.select("#graph1").selectAll("*").remove();
    d3.select("#graph2").selectAll("*").remove();

    // Graph 1: Bar chart for item totalItems
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg1 = d3.select("#graph1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(itemNames)
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(validTotalItems)])
        .nice()
        .range([height, 0]);

    svg1.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg1.append("g").call(d3.axisLeft(y));

    svg1.selectAll(".bar")
        .data(validItems)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d._id))
        .attr("y", d => y(d.totalItems))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.totalItems))
        .append("title")
        .text(d => `Total Items: ${d.totalItems}`);

    svg1.selectAll(".label")
        .data(validItems)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d._id) + x.bandwidth() / 2)
        .attr("y", d => y(d.totalItems) - 5)
        .attr("text-anchor", "middle")
        .text(d => `${d.totalItems}`);

    // Graph 2: Pie chart for country distribution
    const countryCount = countries.reduce((acc, country) => {
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.keys(countryCount).map(country => ({
        country: country,
        count: countryCount[country],
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

    const arcs = svg2.selectAll("arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => d3.schemeCategory10[d.index]);

    arcs.append("text")
        .attr("transform", d => "translate(" + arc.centroid(d) + ")")
        .attr("text-anchor", "middle")
        .text(d => `${d.data.country} (${d.data.count})`);
}