// Module for retrieving purchases

// Load purchase history
export function loadPurchaseHistory() {
    document.addEventListener("DOMContentLoaded", function() {
        const userId = localStorage.getItem('isAuthenticated'); // Retrieve user ID from local storage
        const loadingIndicator = document.getElementById('loadingIndicator');
        const tableElements = document.getElementsByClassName('AREATable');
        const tableBody = document.querySelector('#purchaseHistoryTable tbody');

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        tableBody.innerHTML = ''; // Clear previous purchases

        fetch('http://localhost:3000/purchases')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch purchases');
                }
                return response.json();
            })
            .then(purchases => {
                // Sort purchases by date in descending order
                purchases.sort((a, b) => new Date(b.date) - new Date(a.date));

                const purchasePromises = purchases
                    .filter(purchase => purchase.customerId === userId)
                    .map(purchase => 
                        fetch(`http://localhost:3000/items/${purchase.itemId}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to fetch item details');
                                }
                                return response.json();
                            })
                            .then(item => {
                                return {
                                    img: item.img,
                                    name: item.name,
                                    description: item.description,
                                    date: purchase.date,
                                    price: item.price
                                };
                            })
                            .catch(error => {
                                console.error('Error fetching item details:', error);
                                return null;
                            })
                    );

                Promise.all(purchasePromises)
                    .then(results => {
                        results
                            .filter(result => result !== null)
                            .forEach(result => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td><img src="${result.img}" alt="${result.name}" style="width: 50px; height: auto;"></td>                                   
                                    <td>${result.name}</td>
                                    <td>${result.description}</td>
                                    <td>${result.date}</td>
                                    <td>${result.price} $</td>
                                `;
                                tableBody.appendChild(row);
                            });
                    })
                    .finally(() => {
                        // Hide loading indicator
                        loadingIndicator.style.display = 'none';
                        for (let element of tableElements) {
                            element.style.display = 'table';
                        }
                    })
                    .catch(error => {
                        console.error('Error processing purchase results:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching purchases:', error);
                loadingIndicator.textContent = 'Error loading data';
            });
    });
}

// Load order history
export function loadOrderHistory() {
    document.addEventListener("DOMContentLoaded", function() {

        const loadingIndicator = document.getElementById('loadingIndicator');
        const tableBody = document.querySelector('#orderHistoryTable tbody');
        const tableElements = document.getElementsByClassName('AREATable');

        // Show loading indicator
        loadingIndicator.style.display = 'block';        
        tableBody.innerHTML = '';

        fetch('http://localhost:3000/purchases')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch purchases');
                }
                return response.json();
            })
            .then(purchases => {
                // Sort purchases by date in descending order
                purchases.sort((a, b) => new Date(b.date) - new Date(a.date));

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
                        .catch(error => {
                            console.error('Error fetching item details:', error);
                            return null;
                        })
                );

                Promise.all(itemPromises)
                    .then(results => {
                        results
                            .filter(result => result !== null) // Filter out any null results
                            .forEach(({ item, purchase }) => {
                                const row = document.createElement('tr');
                                row.innerHTML = `                                    
                                    <td>${purchase.customerId}</td>
                                    <td><img src="${item.img}" alt="${item.name}" style="width: 50px; height: auto;"></td>
                                    <td>${item.name}</td>
                                    <td>${item.description}</td>
                                    <td>${purchase.date}</td>
                                    <td>${item.price} $</td>
                                `;
                                tableBody.appendChild(row);
                            });
                    })
                    .finally(() => {
                        // Hide loading indicator
                        loadingIndicator.style.display = 'none';
                        for (let element of tableElements) {
                            element.style.display = 'table';
                        }
                    })
                    .catch(error => {
                        console.error('Error processing item details:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching purchases:', error);
                loadingIndicator.textContent = 'Error loading data';
            });
    });
}