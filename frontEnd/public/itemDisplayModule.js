// Module for item display

import { getCart, addToCart, removeFromCart } from './cartModule.js';

/// Get items from the database and display them
export async function fetchItems() {
    try {
        const response = await fetch("http://localhost:3000/items");
        const items = await response.json();
        const itemContainer = document.getElementById("itemContainer");
        displayItems(items, itemContainer, addToCart);
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

// Display items with container parameter
export async function displayItems(items, container, callbackFunc) {
    container.innerHTML = "";

    if (items.length === 0 || items == null) {             
        const noResults = document.createElement('div');
        noResults.textContent = 'No items found.';
        container.appendChild(noResults);
    } else {
        items.forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("shop-item");

            const img = document.createElement("img");
            img.src = item.img;
            img.alt = item.name;            

            img.addEventListener("mouseover", () => {
                descriptionPopup.style.display = 'block';
            });

            img.addEventListener("mouseout", () => {
                descriptionPopup.style.display = 'none';
            });

            const name = document.createElement("h3");
            name.textContent = item.name;

            const price = document.createElement("p");
            price.textContent = "Price: $" + item.price;

            const stock = document.createElement("p");
            stock.textContent = item.stock > 0 ? "In stock" : "Out of stock";  
                        
            const descriptionPopup = document.createElement("div");
            descriptionPopup.classList.add("description-popup");
            descriptionPopup.innerHTML = `${item.description}<br><br><strong>Country:</strong> ${item.madeIn}<br><br><strong>Category:</strong> ${item.category}`;

            const viewDetailsButton = document.createElement("button");
            viewDetailsButton.classList.add("view-details");
            viewDetailsButton.addEventListener("mouseover", () => {
                showPopup(viewDetailsButton, item);
            });

            // Add event listener to toggle the visibility of the popup
            viewDetailsButton.addEventListener("click", (event) => {
                const popup = event.currentTarget.nextElementSibling;
                popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
                positionPopup(event.currentTarget);
            });

            const button = document.createElement("button");
            button.textContent = callbackFunc === addToCart ? "Add to Cart" : "Remove from Cart";
            button.addEventListener("click", () => callbackFunc(item));            

            itemDiv.appendChild(img);            
            itemDiv.appendChild(name); 
            itemDiv.appendChild(viewDetailsButton);
            itemDiv.appendChild(descriptionPopup);          
            itemDiv.appendChild(price);
            itemDiv.appendChild(stock);
            itemDiv.appendChild(button);

            container.appendChild(itemDiv);
        });
    }
}

// Align popup position
function positionPopup(button) {
    const popup = button.nextElementSibling;
    const rect = button.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
}

// Load cart items
export function loadCartItems() {
    const cartItems = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        const noItemsMessage = document.createElement('p');
        noItemsMessage.textContent = 'Your cart is empty.';
        cartItemsContainer.appendChild(noItemsMessage);
    } else {
        displayItems(cartItems, cartItemsContainer, removeFromCart);
    }

}