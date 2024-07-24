
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

// Load purchase history
export function loadPurchaseHistory() {
    document.addEventListener("DOMContentLoaded", function() {
        const userId = localStorage.getItem('isAuthenticated'); // Retrieve user ID from local storage

        fetch('http://localhost:3000/purchases')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch purchases');
                }
                return response.json();
            })
            .then(purchases => {
                const tableBody = document.querySelector('#purchaseHistoryTable tbody');
                tableBody.innerHTML = ''; // Clear previous purchases

                purchases.forEach(purchase => {
                    if (purchase.customerId === userId) {
                        fetch(`http://localhost:3000/items/${purchase.itemId}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to fetch item details');
                                }
                                return response.json();
                            })
                            .then(item => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${item.name}</td>
                                    <td>${item.description}</td>
                                    <td>${purchase.date}</td>
                                    <td>${item.price} $</td>
                                `;
                                tableBody.appendChild(row);
                            })
                            .catch(error => {
                                console.error('Error fetching item details:', error);
                            });
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching purchases:', error);
            });
    });
}
