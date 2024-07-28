// Authentication module for login, logout and permissions

export const showLinksEvent = new Event('showLinks');
export const hideLinksEvent = new Event('hideLinks');

const restrictedPages = ['items', 'items.html', 'myAccount', 'myAccount.html', 'orders', 'orders.html', 'statistics', 'statistics.html'];

// Fetch authentication data
export function fetchAuthenticationStatus() {
    return fetch('http://localhost:3000/auth/status', {
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
            return data;
        })
        .catch(error => {
            console.error('Error checking authentication status:', error);
            return null;
        });
}

// Check authentication status
export function checkAuthentication() {
    fetchAuthenticationStatus()
        .then(data => {
            if (!data) {
                throw new Error('Failed to check authentication status');
            }

            console.log('Authentication status:', data);

            // Update the navbar based on the authentication status
            var authStatusElement = document.getElementById('authStatus');

            if (authStatusElement) {
                if (data.isAuthenticated) {
                    console.log('User is authenticated');
                    setAuthentication(data);
                } else {
                    console.log('User is not authenticated');
                    removeAuthentication();
                }
                // Update display and restrictions based on authentication
                updateDisplay(data, authStatusElement);
                checkRestrictions(data);
            } else {
                console.error('authStatus element not found');
            }
        })
        .catch(error => {
            console.error('Error checking authentication status:', error);
        });
}

// Get authentication from local storage
export function getAuthentication() {
    const userId = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');

    if (userId && userRole) {
        return {
            isAuthenticated: true,
            userId: userId,
            userRole: userRole
        };
    } else {
        return {
            isAuthenticated: false,
            userId: null,
            userRole: null
        };
    }
}

// Set authentication in local storage
export function setAuthentication(data) {
    localStorage.setItem('isAuthenticated', data.user._id);
    localStorage.setItem('userRole', data.user.role);
}

// Remove authentication from local storage
export function removeAuthentication() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
}

// Update display based on authentication
export function updateDisplay(data, authStatusElement) {
    // If authenticated, update account and logout    
    if (data.isAuthenticated) {
        authStatusElement.innerHTML = '<a id="managerLink" href="/myAccount.html"><img src="/icons/login.png" alt="MyAccount"><b>My account</b></a> | <a id="logoutLink" href="#">Logout</a>';
        addLogoutListener();
        // If the user is authenticated and a manager, display restricted pages
        if (data.user.role == 'manager') {
            document.dispatchEvent(showLinksEvent);
        }
    } else {
        // Revert to unauthorized state
        authStatusElement.innerHTML = '<a href="/login.html"><img src="/icons/login.png" alt="Login">Login</a>';
        document.dispatchEvent(hideLinksEvent);
    }
}

// Check if entering restricted pages unauthorized
export function checkRestrictions(data) {

    // Get current page 
    const currentPage = window.location.pathname.split("/").pop();

    // If the page is restricted and the user is not authenticated or does not follow the requirements, redirect to main page      
    if (restrictedPages.includes(currentPage)) {
        if ((data.isAuthenticated && data.user.role !== 'manager' && currentPage !== 'myAccount.html') || (!data.isAuthenticated)) {
            window.location.href = 'shop.html';
            return;
        }
    }
}

// Handle registration process
export function handleRegistration() {
    $(document).ready(function () {
        $('#registerForm').submit(function (event) {
            event.preventDefault();

            var formData = {
                username: $('#name').val(),
                email: $('#email').val(),
                password: $('#password').val(),
                phone: $('#phone').val(),
                address: $('#address').val(),
                role: $('#role').val()
            };

            var url = '';
            if (formData.role === 'customer') {
                url = 'http://localhost:3000/auth/register/customer';
            } else if (formData.role === 'manager') {
                url = 'http://localhost:3000/auth/register/manager';
            }

            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(formData),
                contentType: 'application/json',
                success: function (response) {
                    console.log(response);
                    window.location.href = 'login.html';
                },
                error: function (xhr, status, error) {
                    console.error(error);
                    if (xhr.status === 409) {
                        $('#errorMessage').text('Username or email already exists. Please try again.').show();
                    } else {
                        $('#errorMessage').text('Registration failed. Please try again.').show();
                    }
                },
                xhrFields: {
                    withCredentials: true
                },
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        });
    });
}

// Handle login process
export function handleLogin(formData) {
    return fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to log in');
            }
            return response.json();
        })
        .then(data => {
            console.log('Login response data:', data);
            // Set local storage
            if (data.isAuthenticated) {
                setAuthentication(data);
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            throw error;
        });
}

// Handle logout process
function handleLogout(event) {
    event.preventDefault();

    fetch('http://localhost:3000/auth/logout', {
        method: 'GET',
        credentials: 'include', // Include credentials (cookies)
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(() => {
            console.log('Logged out successfully.');
            // Clear local storage
            removeAuthentication();
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
}

// Add login listener
export function addLoginListener() {
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        var formData = {
            username: $('#name').val(),
            email: $('#email').val(),
            password: $('#password').val()
        };

        // Perform login and return the person to the previous page
        handleLogin(formData)
            .then(() => {
                console.log('Login successful');
                window.location.href = document.referrer;
            })
            .catch(error => {
                console.error('Error during login:', error);
                $('#errorMessage').show();
            });
    });
}

// Add logout listener
export function addLogoutListener() {
    var logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    } else {
        console.error('Logout link not found');
    }
}

// Add show and hide restricted pages listeners
document.addEventListener('showLinks', () => {
    var ordersLink = document.getElementById('ordersLink');
    var itemsLink = document.getElementById('itemsLink');
    var statisticsLink = document.getElementById('statisticsLink');

    ordersLink.classList.add('visible');
    itemsLink.classList.add('visible');
    statisticsLink.classList.add('visible');
});

document.addEventListener('hideLinks', () => {
    var ordersLink = document.getElementById('ordersLink');
    var itemsLink = document.getElementById('itemsLink');
    var statisticsLink = document.getElementById('statisticsLink');

    ordersLink.classList.remove('visible');
    itemsLink.classList.remove('visible');
    statisticsLink.classList.remove('visible');
});

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