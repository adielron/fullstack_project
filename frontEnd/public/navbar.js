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
                // Check authentication status after including the navbar
                checkAuthentication();
            } else {
                console.error('Navbar element not found');
            }
        })
        .catch(error => console.error('Error fetching navbar:', error));
}

// Function to check authentication status
function checkAuthentication() {
    // Replace with your authentication endpoint
    fetch('http://localhost:3000/auth/status', {
        method: 'GET',
        credentials: 'include', // Include credentials (cookies)
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to check authentication status');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        // Update the navbar based on the authentication status
        var authStatusElement = document.getElementById('authStatus');
        if (authStatusElement) {
            if (data.isAuthenticated ) {
                authStatusElement.innerHTML = '<a ><b>Manager</a> </b>| <a href="logout.html">Logout</a>';
            } else {
                authStatusElement.innerHTML = '<a href="login.html">Login / Register </a> ';
            }
        } else {
            console.error('authStatus element not found');
        }
    })
    .catch(error => {
        console.error('Error checking authentication status:', error);
    });
}

// Call the function to include the navbar content when the page loads
window.onload = function() {
    includeNavbar();
};
