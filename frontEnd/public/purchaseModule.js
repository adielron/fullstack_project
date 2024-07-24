// Module for retrieving purchases

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

// Load order history
export function loadOrderHistory() {
    document.addEventListener("DOMContentLoaded", function() {
        fetch('http://localhost:3000/purchases')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch purchases');
                }
                return response.json();
            })
            .then(purchases => {
                const tableBody = document.querySelector('#orderHistoryTable tbody');
                tableBody.innerHTML = ''; // Clear previous purchases

                const itemPromises = purchases.map(purchase =>
                    fetch(`http://localhost:3000/items/${purchase.itemId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch item details');
                            }
                            return response.json();
                        })
                        .then(item => ({
                            item,
                            purchase
                        }))
                );

                Promise.all(itemPromises)
                    .then(results => {
                        results.forEach(({ item, purchase }) => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${purchase.customerId}</td>
                                <td>${item.name}</td>
                                <td>${item.description}</td>
                                <td>${purchase.date}</td>
                                <td>${item.price} $</td>
                            `;
                            tableBody.appendChild(row);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching item details:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching purchases:', error);
            });
    });
}