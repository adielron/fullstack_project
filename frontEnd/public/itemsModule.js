
// Load table items
export function loadItemTableData() {
    fetch('http://localhost:3000/items')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            return response.json();
        })
        .then(items => {
            const tableBody = document.querySelector('#itemsTable tbody');
            tableBody.innerHTML = '';

            if (items.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7">No items available</td></tr>';
                return;
            }

            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.category}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.price}</td>
                    <td>${item.stock}</td>
                    <td>
                        <button class="edit-btn" data-id="${item.id}">Edit</button>
                        <button class="delete-btn" data-id="${item.id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);

                // Add event listeners for edit and delete buttons
                addEditEventListener(row.querySelector('.edit-btn'));
                addDeleteEventListener(row.querySelector('.delete-btn'));
            });
        })
        .catch(error => {
            console.error('Error fetching items:', error);
        });
}

// Create new item
export function createItem() {
    $(document).ready(function() {
        $('#createItemForm').submit(function(event) {
            event.preventDefault();

            // Serialize the form data
            var formData = $(this).serialize();

            // Send a POST request to the backend
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/items',
                data: formData,
                contentType: 'application/x-www-form-urlencoded',
                xhrFields: {
                    withCredentials: true 
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function(response) {
                    // Handle the successful response
                    $('#errorMessage').hide();
                    $('#successMessage').show().delay(3000).fadeOut();
                    $('#createItemForm')[0].reset();

                    // Add the new item to the table
                    const tableBody = $('#itemsTable tbody');
                    const row = $('<tr>').html(`
                        <td>${response.id}</td>
                        <td>${response.category}</td>
                        <td>${response.name}</td>
                        <td>${response.description}</td>
                        <td>${response.price}</td>
                        <td>${response.stock}</td>
                        <td>
                            <button class="edit-btn" data-id="${response.id}">Edit</button>
                            <button class="delete-btn" data-id="${response.id}">Delete</button>
                        </td>
                    `);
                    tableBody.append(row);

                    // Add event listeners for the new edit and delete buttons
                    addEditEventListener(row.querySelector('.edit-btn'));
                    addDeleteEventListener(row.querySelector('.delete-btn'));

                    // Hide the popup
                    $('#createItemPopup').hide();
                },
                error: function(xhr, status, error) {
                    // Handle errors
                    console.error('Only employees can add items to the store', error);
                    $('#errorMessage').show();
                }
            });
        });
    });
}

// Add event listener for edit button
export function addEditEventListener(editButton) {
    editButton.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');

        // Fetch the current item details
        fetch(`http://localhost:3000/items/${itemId}`)
            .then(response => response.json())
            .then(item => {
                // Populate the form with current item details
                document.getElementById('editItemId').value = item.id;
                document.getElementById('editName').value = item.name;
                document.getElementById('editCategory').value = item.category;
                document.getElementById('editDescription').value = item.description;
                document.getElementById('editPrice').value = item.price;
                document.getElementById('editStock').value = item.stock;

                // Show the edit item form
                document.getElementById('editItemForm').style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching item details:', error);
            });
    });
}

// Handle form submission for editing an item
export function handleEditItemForm() {
    document.getElementById('editItemForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const itemId = document.getElementById('editItemId').value;
        const formData = {
            name: document.getElementById('editName').value,
            category: document.getElementById('editCategory').value,
            description: document.getElementById('editDescription').value,
            price: document.getElementById('editPrice').value,
            stock: document.getElementById('editStock').value
        };

        fetch(`http://localhost:3000/items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update item');
            }
            return response.json();
        })
        .then(updatedItem => {
            // Update the row with the new details
            const row = document.querySelector(`button.edit-btn[data-id="${itemId}"]`).closest('tr');
            row.querySelector('td:nth-child(3)').textContent = updatedItem.name;
            row.querySelector('td:nth-child(4)').textContent = updatedItem.description;
            row.querySelector('td:nth-child(5)').textContent = updatedItem.price;
            row.querySelector('td:nth-child(6)').textContent = updatedItem.stock;

            // Hide the edit item form
            document.getElementById('editItemForm').style.display = 'none';
        })
        .catch(error => {
            console.error('Error updating item:', error);
        });
    });
}

// Add event listener for delete button
export function addDeleteEventListener(deleteButton) {
    deleteButton.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');

        // Send DELETE request to remove the item
        fetch(`/items/${itemId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            return response.json();
        })
        .then(() => {
            // Remove the item row from the table
            this.closest('tr').remove();
        })
        .catch(error => {
            console.error('Error deleting item:', error);
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

// Handle Close button click in the edit item form
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('closeEditPopupBtn').addEventListener('click', function() {
        document.getElementById('editItemForm').style.display = 'none';
    });
});

// Initialize the edit item form handling
document.addEventListener('DOMContentLoaded', handleEditItemForm);