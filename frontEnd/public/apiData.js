
import { updateNavbarDisplay } from './navbar.js';

// List of top 5 electronic companies on NASDAQ
const companies = [
    { name: 'Apple', symbol: 'AAPL' },
    { name: 'Intel', symbol: 'INTC' },
    { name: 'NVIDIA', symbol: 'NVDA' },
    { name: 'Sony', symbol: 'SONY' },
    { name: 'HP', symbol: 'HPQ' }
];

let apiKey;

// Function to fetch API key from the server
async function fetchApiKey() {
    try {
        const response = await fetch('/config');
        const data = await response.json();
        apiKey = data.apiKey;
    } catch (error) {
        console.error('Error fetching API key:', error);
    }
}

// Function to fetch and display company information
async function fetchCompanyInfo(symbol) {
    const url = `https://api.polygon.io/v1/open-close/${symbol}/2023-06-21?adjusted=true&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Stock not found');
        }
        const stockInfo = await response.json();

        return {
            symbol: symbol,
            close: stockInfo.close,
            open: stockInfo.open
        };
    } catch (error) {
        console.error('Error fetching stock information:', error);
        return null;
    }
}

// Function to display company information
async function displayCompanies() {
    const statsContainer = document.getElementById('statsContainer');
    statsContainer.innerHTML = '';

    for (const company of companies) {
        const companyInfo = await fetchCompanyInfo(company.symbol);
        if (companyInfo) {
            const companyDiv = document.createElement('div');
            companyDiv.classList.add('company-item');
            companyDiv.innerHTML = `
                <span><strong>${company.name} (${company.symbol})</strong></span>
                <span>Current Price: $${companyInfo.close.toFixed(2)}</span>
                <span>Opening Price: $${companyInfo.open.toFixed(2)}</span>
            `;
            statsContainer.appendChild(companyDiv);
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('company-item');
            errorDiv.textContent = `Error fetching data for ${company.name} (${company.symbol})`;
            statsContainer.appendChild(errorDiv);
        }
    }
}

// Function to display a searched stock symbol
async function searchStockSymbol(symbol) {
    const statsContainer = document.getElementById('statsContainer');
    statsContainer.innerHTML = ''; // Clear existing data

    const companyInfo = await fetchCompanyInfo(symbol);
    if (companyInfo) {
        const companyDiv = document.createElement('div');
        companyDiv.classList.add('company-item');
        companyDiv.innerHTML = `
            <span><strong>${symbol}</strong></span>
            <span>Current Price: $${companyInfo.close.toFixed(2)}</span>
            <span>Opening Price: $${companyInfo.open.toFixed(2)}</span>
        `;
        statsContainer.appendChild(companyDiv);
    } else {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('company-item');
        errorDiv.textContent = `Error fetching data for ${symbol}`;
        statsContainer.appendChild(errorDiv);
    }
}

// Fetch API key and display companies when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchApiKey().then(displayCompanies);

    // Event listener for search button click
    document.getElementById('searchButton').addEventListener('click', function() {
        const symbol = document.getElementById('stockSymbolInput').value.trim().toUpperCase();
        if (symbol) {
            searchStockSymbol(symbol);
        } else {
            alert('Please enter a stock symbol');
        }
    });

    updateNavbarDisplay();
});