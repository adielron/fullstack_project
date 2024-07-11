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
                // Add logout listener after including the navbar
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
        console.log(data.user);

        // Update the navbar based on the authentication status
        var authStatusElement = document.getElementById('authStatus');
        if (authStatusElement) {
            if (data.isAuthenticated) {
                localStorage.setItem('isAuthenticated', data.user._id);
                authStatusElement.innerHTML = '<a id="managerLink"><b>Manager</b></a> | <a id="logoutLink" href="#">Logout</a>';
                addLogoutListener();

            } else {
                authStatusElement.innerHTML = '<a href="/">Login / Register</a>';
            }
        } else {
            console.error('authStatus element not found');
        }
    })
    .catch(error => {
        console.error('Error checking authentication status:', error);
    });
}

// Function to add logout listener
function addLogoutListener() {
    var logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();

            // Clear local storage
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/';
            fetch('http://localhost:3000/auth/logout', {
                method: 'GET',
                credentials: 'include', // Include credentials (cookies)
                headers: {
                    'Accept': 'application/json'
                }
            })
            console.log("asdasd");

            // Send a logout request to the server

            
        });
    } else {
        console.error('Logout link not found');
    }
}

// Call the function to include the navbar content when the page loads
window.onload = function() {
    includeNavbar();
};
