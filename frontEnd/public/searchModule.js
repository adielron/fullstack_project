// Module to handle searching

import { displayItems, fetchItems } from './itemDisplayModule.js';
import { addToCart } from './cartModule.js';

// Fetch items based on search query
export async function fetchSearchResults(query, container) {
    try {
        const response = await fetch(`http://localhost:3000/items/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }
        const items = await response.json();
        displayItems(items, container, addToCart);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

// Initialize search functionality
export function initializeSearch() {
    function getQueryParameter(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Fetch search results based on query parameter
    const query = getQueryParameter('query');      
    if (query) {        
        const container = document.getElementById('itemContainer');
        fetchSearchResults(query, container);

        // Update the header with the query
        const searchHeader = document.querySelector('h1');
        if (searchHeader) {
            searchHeader.textContent = `Displaying search results for "${query}"`;
        }

        // Add event listener to the search input
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.querySelector('.searchButton');

        if (searchInput && searchButton) {
            // Initially disable the button if the input is empty
            searchButton.disabled = !searchInput.value.trim();

            // Enable or disable the button based on input value
            searchInput.addEventListener('input', () => {
                searchButton.disabled = !searchInput.value.trim();
            });
        }
    }
}

// Initialize form tabs
export function initializeTabs() {
    function openForm(evt, formName) {
        // Hide all tab contents
        const tabcontent = document.getElementsByClassName("tabcontent");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Remove "active" class from all tab links
        const tablinks = document.getElementsByClassName("tablinks");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Display the selected tab and set "active" class on the button
        document.getElementById(formName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    // Attach openForm function to window object to access in HTML onclick
    window.openForm = openForm;

    // Open the default tab
    document.getElementById("defaultOpen").click();
}

// Initialize tabs when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
});

// Add event listener for the advanced search buttons
export function initializeAdvancedSearch() {
    document.getElementById("advancedSearchButton1").addEventListener("click", () => {
        const priceFrom = document.getElementById("priceFromInput").value.trim();
        const priceTo = document.getElementById("priceToInput").value.trim();
        const quality = document.getElementById("qualityInput").value.trim();
        const distributor = document.getElementById("distributorInput").value.trim();
        const itemsList = document.getElementById('itemContainer');
        fetchAdvancedSearch1(priceFrom, priceTo, quality, distributor, itemsList);
    });

    document.getElementById("advancedSearchButton2").addEventListener("click", () => {
        const color = document.getElementById("colorInput").value.trim();
        const madeIn = document.getElementById("madeInInput").value.trim();
        const weight = document.getElementById("weightInput").value.trim();
        const itemsList = document.getElementById('itemContainer');
        fetchAdvancedSearch2(color, madeIn, weight, itemsList);
    });

    document.getElementById("resetButton1").addEventListener("click", () => {        
        fetchItems();
    });

    document.getElementById("resetButton2").addEventListener("click", () => {        
        fetchItems();
    });
}

// Fetch items based on criteria from form 1
export async function fetchAdvancedSearch1(priceFrom, priceTo, quality, distributor, container) {
    try {
        const response = await fetch(
            `http://localhost:3000/items/price-and-quality?priceFrom=${priceFrom}&priceTo=${priceTo}&quality=${quality}&distributor=${distributor}`
        );
        const items = await response.json();
        console.log(items);
        displayItems(items, container, addToCart);
    } catch (error) {
        console.error("Error fetching items:", error);
        alert(error);
    }
}

// Fetch items based on criteria from form 2
export async function fetchAdvancedSearch2(color, madeIn, weight, container) {
    try {
        const response = await fetch(
            `http://localhost:3000/items/criteria?color=${color}&madeIn=${madeIn}&weight=${weight}`
        );
        const items = await response.json();
        console.log(items);
        displayItems(items, container, addToCart);
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

// Fetch selectable options for filters
export async function fetchSelectableOptions(valueExtractor, input, defaultOptionText) {
    try {
        const response = await fetch("http://localhost:3000/items");
        const items = await response.json();
        console.log(items); // Ensure the items data is correctly fetched

        // Extract unique values and sort alphabetically
        const values = [...new Set(items.map(valueExtractor))].sort();

        // Populate select options
        const select = document.getElementById(input);
        select.innerHTML = `<option value="">${defaultOptionText}</option>`;
        values.forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}