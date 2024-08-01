// Module for item management

import { getAuthentication } from './authenticationModule.js';

// Load table items
export function loadItemTableData() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const tableBody = document.querySelector('#itemsTable tbody');
    const tableElements = document.getElementsByClassName('AREATable');

    // Show loading indicator
    loadingIndicator.style.display = 'block';
    tableBody.innerHTML = ''; // Clear previous data

    fetch('http://localhost:3000/items')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            return response.json();
        })
        .then(items => {
            tableBody.innerHTML = '';

            if (items.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7">No items available</td></tr>';
                return;
            }

            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item._id}</td>
                    <td><img src="${item.img}" alt="${item.name}" style="width: 50px; height: auto;"></td>
                    <td>${item.category}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.price}</td>
                    <td>${item.stock}</td>
                    <td>
                        <button class="edit-btn" data-id="${item._id}">Edit</button>
                        <button class="delete-btn" data-id="${item._id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);

                // Add event listeners for edit and delete buttons
                addEditEventListener(row.querySelector('.edit-btn'));
                addDeleteEventListener(row.querySelector('.delete-btn'));
            });
        })
        .finally(() => {
            // Hide loading indicator and show AREATable elements
            loadingIndicator.style.display = 'none';
            for (let element of tableElements) {
                element.style.display = 'table';
            }
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            loadingIndicator.textContent = 'Error loading data';
        });
}

// Function to filter table items based on search input
export function filterTableItems(query) {
    const tableBody = document.querySelector('#itemsTable tbody');
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const itemName = cells[2].textContent.toLowerCase();
        const itemDescription = cells[3].textContent.toLowerCase();
        
        if (itemName.includes(query.toLowerCase()) || itemDescription.includes(query.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', (event) => {
    const query = event.target.value.trim();
    filterTableItems(query);
});

// Handle reset query
document.getElementById("resetButton").addEventListener("click", () => { 
    const searchInput = document.getElementById('searchInput');  
    searchInput.value = "";
    loadItemTableData();
});

// Create new item
export function createItem() {
    $(document).ready(function () {
        $('#createItemForm').submit(function (event) {
            event.preventDefault();

            const authStatus = getAuthentication();

            // Check if the user is authenticated as a manager
            if (!authStatus.isAuthenticated || authStatus.userRole !== 'manager') {
                $('#errorMessage').text('You must be a manager to add items.').show();
                return;
            }

            var jsonData = {};
            $('#createItemForm').find('input, textarea, select').each(function () {
                jsonData[this.name] = $(this).val();
            });

            // Handle checkbox separately
            jsonData.publishToFacebook = $('#publishToFacebook').is(':checked');


            // Send a POST request to the backend
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/items',
                data: JSON.stringify(jsonData),
                contentType: 'application/json',
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                success: function (response) {
                    // Handle the successful response
                    $('#errorMessage').hide();
                    $('#successMessage').show().delay(3000).fadeOut();
                    $('#createItemForm')[0].reset();

                    // Add the new item to the table
                    const tableBody = $('#itemsTable tbody');
                    const row = $('<tr>').html(`
                        <td>${response._id}</td>
                        <td><img src="${item.img}" alt="${item.name}" style="width: 50px; height: auto;"></td>
                        <td>${response.category}</td>
                        <td>${response.name}</td>
                        <td>${response.description}</td>
                        <td>${response.price}</td>
                        <td>${response.stock}</td>
                        <td>
                            <button class="edit-btn" data-id="${response._id}">Edit</button>
                            <button class="delete-btn" data-id="${response._id}">Delete</button>
                        </td>
                    `);
                    tableBody.append(row);

                    // Add event listeners for the new edit and delete buttons
                    addEditEventListener(row.find('.edit-btn')[0]);
                    addDeleteEventListener(row.find('.delete-btn')[0]);

                    // Hide the popup
                    $('#createItemPopup').hide();
                },
                error: function (xhr, status, error) {
                    // Handle errors
                    console.error('Error adding item:', error);
                    $('#errorMessage').text('Failed to add item. Please try again.').show();
                }
            });
        });
    });
}

// Add event listener for edit button
export function addEditEventListener(editButton) {
    editButton.addEventListener('click', function () {
        const itemId = this.getAttribute('data-id');

        // Fetch the current item details
        fetch(`http://localhost:3000/items/${itemId}`, {
            method: 'GET',
            credentials: 'include' // Ensure cookies are sent if needed
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch item details');
                }
                return response.json();
            })
            .then(item => {
                console.log('Fetched item details:', item);

                // Populate the form with current item details
                document.getElementById('editItemId').value = item._id;
                document.getElementById('editName').value = item.name || '';
                document.getElementById('editCategory').value = item.category || '';
                document.getElementById('editDescription').value = item.description || '';
                document.getElementById('editPrice').value = item.price || '';
                document.getElementById('editStock').value = item.stock || '';
                document.getElementById('editWeight').value = item.weight || '';
                document.getElementById('editMadeIn').value = item.madeIn || '';
                document.getElementById('editColor').value = item.color || '';
                document.getElementById('editDistributor').value = item.distributor || '';
                document.getElementById('editQuality').value = item.quality || '';
                document.getElementById('editImg').value = item.img || '';

                // Show the edit item form and popup
                document.getElementById('editItemPopup').style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching item details:', error);
                alert('Failed to load item details. Please try again.');
            });
    });
}

// Handle form submission for editing an item
export function handleEditItemForm() {
    $(document).ready(function () {
        $('#editItemForm').submit(function (event) {
            event.preventDefault();

            const authStatus = getAuthentication();

            // Check if the user is authenticated as a manager
            if (!authStatus.isAuthenticated || authStatus.userRole !== 'manager') {
                $('#errorMessage').text('You must be a manager to edit items.').show();
                return;
            }

            // Serialize the form data
            var formData = $(this).serialize();
            var itemId = $('#editItemId').val(); // Get the item ID

            // Send a PUT request to the backend
            $.ajax({
                type: 'PUT',
                url: `http://localhost:3000/items/${itemId}`,
                data: formData,
                contentType: 'application/x-www-form-urlencoded',
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (response) {
                    // Handle the successful response
                    $('#editErrorMessage').hide();
                    $('#editSuccessMessage').show().delay(3000).fadeOut();
                    $('#editItemForm')[0].reset();

                    // Update the table row with the new details
                    const row = $(`button.edit-btn[data-id="${itemId}"]`).closest('tr');
                    row.html(`
                        <td>${response._id}</td>
                        <td><img src="${response.img}" alt="${response.name}" style="width: 50px; height: auto;"></td>
                        <td>${response.category}</td>
                        <td>${response.name}</td>
                        <td>${response.description}</td>
                        <td>${response.price}</td>
                        <td>${response.stock}</td>
                        <td>
                            <button class="edit-btn" data-id="${response._id}">Edit</button>
                            <button class="delete-btn" data-id="${response._id}">Delete</button>
                        </td>
                    `);

                    // Add event listeners for the updated edit and delete buttons
                    addEditEventListener(row.find('.edit-btn')[0]);
                    addDeleteEventListener(row.find('.delete-btn')[0]);

                    // Hide the edit item form and popup
                    $('#editItemPopup').hide();
                },
                error: function (xhr, status, error) {
                    // Handle errors
                    console.error('Error updating item:', error);
                    $('#editErrorMessage').show();
                }
            });
        });
    });
}

// Add event listener for delete button
export function addDeleteEventListener(deleteButton) {
    deleteButton.addEventListener('click', function () {
        const itemId = this.getAttribute('data-id');

        const authStatus = getAuthentication();

        // Check if the user is authenticated as a manager
        if (!authStatus.isAuthenticated || authStatus.userRole !== 'manager') {
            $('#errorMessage').text('You must be a manager to delete items.').show();
            return;
        }

        // Confirm deletion
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        // Send DELETE request to remove the item
        fetch(`http://localhost:3000/items/${itemId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete item: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => {
                // Remove the item row from the table
                this.closest('tr').remove();
            })
            .catch(error => {
                console.error('Error deleting item:', error);
                alert('Failed to delete item. Please try again.');
            });
    });
}

// Handle Create Item button click
document.getElementById('createItemBtn').addEventListener('click', function () {
    document.getElementById('createItemPopup').style.display = 'block';
    document.getElementById('editItemForm').style.display = 'none';
});

// Handle Close button click in the popup
document.getElementById('closePopupBtn').addEventListener('click', function () {
    document.getElementById('createItemPopup').style.display = 'none';
});

// Initialize the edit item form handling
document.addEventListener('DOMContentLoaded', handleEditItemForm);

// Handle Close button click in the edit item form
document.getElementById('closeEditPopupBtn').addEventListener('click', function () {
    document.getElementById('editItemForm').reset();
    document.getElementById('editItemPopup').style.display = 'none';
});