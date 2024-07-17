// Authentication module for login, logout and permissions

// Check authentication
export function checkAuthentication() {
    fetch('http://localhost:3000/auth/status', {
        method: 'GET',
        credentials: 'include',
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
                authStatusElement.innerHTML = '<a id="managerLink" href="/myAccount.html"><img src="/icons/login.png" alt="MyAccount"><b>My account</b></a> | <a id="logoutLink" href="#">Logout</a>';
                addLogoutListener();
            } else {
                localStorage.removeItem('isAuthenticated');
                authStatusElement.innerHTML = '<a href="/login.html"><img src="/icons/login.png" alt="Login">Login</a>';
            }
        } else {
            console.error('authStatus element not found');
        }
    })
    .catch(error => {
        console.error('Error checking authentication status:', error);
    });
}

// Login
export function loginUser(credentials) {
    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        if (data.isAuthenticated) {
            checkAuthentication();
            // Redirect or update the UI as needed
            window.location.href = '/';
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
    });
}

// Add logout listener
// Add logout listener
export function addLogoutListener() {
    var logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();

            // Clear local storage
            localStorage.removeItem('isAuthenticated');

            // Send a logout request to the server
            fetch('http://localhost:3000/auth/logout', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to log out');
                }
                // Redirect to home page to update the UI
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Error during logout:', error);
                // Redirect to home page even if there is an error during logout
                window.location.href = '/';
            });
        });
    } else {
        console.error('Logout link not found');
    }
}