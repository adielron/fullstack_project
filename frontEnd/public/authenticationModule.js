// Authentication module for login, logout and permissions

export const showLinksEvent = new Event('showLinks');
export const hideLinksEvent = new Event('hideLinks');

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
            console.log('Authentication status:', data);

            // Update the navbar based on the authentication status
            var authStatusElement = document.getElementById('authStatus');

            if (authStatusElement) {
                if (data.isAuthenticated) {
                    console.log('User is authenticated');
                    localStorage.setItem('isAuthenticated', data.user._id);
                    localStorage.setItem('userRole', data.user.role);
                    
                    authStatusElement.innerHTML = '<a id="managerLink" href="/myAccount.html"><img src="/icons/login.png" alt="MyAccount"><b>My account</b></a> | <a id="logoutLink" href="#">Logout</a>';
                    addLogoutListener();
                    document.dispatchEvent(showLinksEvent);
                } else {
                    console.log('User is not authenticated');
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('userRole');
                    authStatusElement.innerHTML = '<a href="/login.html"><img src="/icons/login.png" alt="Login">Login</a>';
                    document.dispatchEvent(hideLinksEvent);
                }
            } else {
                console.error('authStatus element not found');
            }
        })
        .catch(error => {
            console.error('Error checking authentication status:', error);
        });
}

// Fetch account details
export function fetchAccountDetails() {
    fetch('http://localhost:3000/auth/status', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            return response.json();
        })
        .then(data => {
            // Update labels with user details
            console.log(data);
            var userNameLabel = document.getElementById('userNameLabel');
            var userRoleLabel = document.getElementById('userRoleLabel');

            if (userNameLabel && userRoleLabel) {
                userNameLabel.textContent = `Username: ${data.user.username}`;
                userRoleLabel.textContent = `Role: ${data.user.role}`;
            } else {
                console.error('Labels not found');
            }

     

        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}


// Perform login operation
export function loginUser(credentials) {
    return fetch('http://localhost:3000/auth/login', {
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
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            throw error;
        });
}

// Add logout listener
export function addLogoutListener() {
    var logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (event) {
            event.preventDefault();

            // Clear local storage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            fetch('http://localhost:3000/auth/logout', {
                method: 'GET',
                credentials: 'include', // Include credentials (cookies)
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(() => {
                    window.location.href = '/';
                })
                .catch(error => {
                    console.error('Error logging out:', error);
                });
        });
    } else {
        console.error('Logout link not found');
    }
}

document.addEventListener('showLinks', () => {
    var itemsLink = document.getElementById('itemsLink');
    var statisticsLink = document.getElementById('statisticsLink');

    itemsLink.classList.add('visible');
    statisticsLink.classList.add('visible');
});

document.addEventListener('hideLinks', () => {
    var itemsLink = document.getElementById('itemsLink');
    var statisticsLink = document.getElementById('statisticsLink');

    itemsLink.classList.remove('visible');
    statisticsLink.classList.remove('visible');
});