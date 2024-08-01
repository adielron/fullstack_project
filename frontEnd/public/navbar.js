
import { checkAuthentication } from './authenticationModule.js'
import { displayCartItemCount } from './cartModule.js';

// Function to include the navbar content
function includeNavbar() {
    // Fetch the navbar HTML content
    fetch('navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load navbar HTML');
            }
            return response.text();
        })
        .then(html => {
            // Insert the navbar HTML into the specified element
            var navbarElement = document.getElementById('navbar');
            if (navbarElement) {
                navbarElement.innerHTML = html;
            } else {
                console.error('Navbar element not found');
            }
        })
        .catch(error => console.error('Error fetching navbar:', error));
}

// Initialize search functionality
function initializeSearch() {
    // document.addEventListener('DOMContentLoaded', () => {// Retrieve elements
    //     const searchInput = document.getElementById('searchInput');
    //     const searchButton = document.getElementById('searchButton');
    //     const searchForm = document.getElementById('searchForm');

    //     if (!searchInput || !searchButton || !searchForm) {
    //         console.error('Search input, button, or form not found');
    //         return;
    //     }

    //     // Add click event listener to the search button
    //     searchButton.addEventListener('click', (event) => {
    //         // Alert to confirm click
    //         alert("hi");

    //         // Get the query value
    //         const query = searchInput.value.trim();
    //         if (query.length === 0) {
    //             event.preventDefault(); // Prevent form submission
    //             alert('Please enter a search query');
    //         } else {
    //             // Set the form action URL with query parameter
    //             searchForm.action = `search_results.html?query=${encodeURIComponent(query)}`;
    //         }
    //     });

    //     // Optionally, you can log the button click to verify it's being reached
    //     console.log('Search button event listener attached');
    // });
}

// Ensure all elements are loaded before running scripts
window.onload = function() {
    includeNavbar();
    //initializeSearch();
};

// Check authentication status and cart item count after including the navbar
export function updateNavbarDisplay() {
    checkAuthentication();
    displayCartItemCount();
}