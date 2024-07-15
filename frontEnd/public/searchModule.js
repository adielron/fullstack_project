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

// Function to fetch selectable options
export async function fetchSelectableOptions(valueExtractor, input, defaultOptionText) {
    try {
        const response = await fetch("http://localhost:3000/items");
        const items = await response.json();
        console.log(items); // Ensure the items data is correctly fetched

        // Extract unique values based on valueExtractor function and sort alphabetically
        const values = [...new Set(items.map(valueExtractor))].sort();

        // Populate select options
        const select = document.getElementById(input);

        // Clear existing options
        select.innerHTML = `<option value="">${defaultOptionText}</option>`;

        // Add options from fetched data
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

// Function to display items based on search criteria
export function displayItems(items) {
    const itemList = document.getElementById('itemContainer');
    itemList.innerHTML = '';

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');

        const img = document.createElement('img');
        img.src = item.img;
        img.alt = item.name;
        img.style.width = '100px'; // Example: Adjust image width as needed

        const name = document.createElement('h3');
        name.textContent = item.name;

        const description = document.createElement('p');
        description.textContent = item.description;

        const price = document.createElement('p');
        price.textContent = 'Price: $' + item.price.toFixed(2); // Format price to 2 decimal places

        const country = document.createElement('p');
        country.textContent = 'Country: ' + item.madeIn;

        const button = document.createElement('button');
        button.textContent = 'Add to Cart';
        button.addEventListener('click', function () {
            addToCart(item); // Example function to add item to cart
        });

        itemDiv.appendChild(img);
        itemDiv.appendChild(name);
        itemDiv.appendChild(description);
        itemDiv.appendChild(price);
        itemDiv.appendChild(country);
        itemDiv.appendChild(button);

        itemList.appendChild(itemDiv);
    });

    if (items.length === 0) {
        const noResults = document.createElement('div');
        noResults.textContent = 'No items found.';
        itemList.appendChild(noResults);
    }
}

export async function fetchAdvancedSearch(color, madeIn, weight) {
    try {
        const response = await fetch(`http://localhost:3000/items/criteria?color=${color}&madeIn=${madeIn}&weight=${weight}`);
        const items = await response.json();
        console.log(items);
        displayItems(items);
        // renderGraphs(items);  // You can call renderGraphs if needed
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}
