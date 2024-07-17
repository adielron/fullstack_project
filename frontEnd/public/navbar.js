
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

// Call the function to include the navbar content when the page loads
window.onload = function() {
    includeNavbar();
};    

// Check authentication status and cart item count after including the navbar
export function updateNavbarDisplay(){    
    checkAuthentication();
    displayCartItemCount();    
}