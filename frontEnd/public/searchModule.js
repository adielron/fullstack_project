// Module to handle searching

// Function to display search results in itemContainer
export function displaySearchResults(results) {
    const itemContainer = document.getElementById('itemContainer');
    itemContainer.innerHTML = '';

    if (results.length === 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.textContent = 'No items found.';
        itemContainer.appendChild(noResultsMessage);
    } else {
        results.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            const img = document.createElement('img');
            img.src = item.img;
            img.alt = item.name;
            img.style.width = '100px'; 

            const name = document.createElement('h3');
            name.textContent = item.name;

            const description = document.createElement('p');
            description.textContent = item.description;

            const price = document.createElement('p');
            price.textContent = 'Price: $' + item.price.toFixed(2);

            const country = document.createElement('p');
            country.textContent = 'Country: ' + item.madeIn;

            const button = document.createElement('button');
            button.textContent = 'Add to Cart';
            button.addEventListener('click', function () {
                addToCart(item);
            });

            itemDiv.appendChild(img);
            itemDiv.appendChild(name);
            itemDiv.appendChild(description);
            itemDiv.appendChild(price);
            itemDiv.appendChild(country);
            itemDiv.appendChild(button);

            itemContainer.appendChild(itemDiv);
        });
    }
}

// Fetch selectable options for filters
export async function fetchSelectableOptions(valueExtractor, input, defaultOptionText) {
    try {
        const response = await fetch("http://localhost:3000/items");
        const items = await response.json();
        console.log(items); // Ensure the items data is correctly fetched

        // Extract unique values and sort alphabetically
        const values = [...new Set(items.map(valueExtractor))].sort();

        // Populate select options
        const select = document.getElementById(input);
        select.innerHTML = `<option value="">${defaultOptionText}</option>`;
        values.forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

// Initialize form tabs
export function initializeTabs() {
    function openForm(evt, formName) {
        // Hide all tab contents
        const tabcontent = document.getElementsByClassName("tabcontent");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Remove "active" class from all tab links
        const tablinks = document.getElementsByClassName("tablinks");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Display the selected tab and set "active" class on the button
        document.getElementById(formName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    // Attach openForm function to window object to access in HTML onclick
    window.openForm = openForm;

    // Open the default tab
    document.getElementById("defaultOpen").click();
}

// Initialize tabs when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
});