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

// Fetch items by category and update the display
export async function fetchItemsByCategory(category) {
    try {        
        const response = await fetch(`http://localhost:3000/items/category?category=${category}`);
        const items = await response.json();
        const itemContainer = document.getElementById("itemContainer");
        displayItems(items, itemContainer, addToCart);
    } catch (error) {
        console.error('Error fetching items:', error);
        alert(error);
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

            const name = document.createElement("h3");                      
            name.textContent = item.name;

            // Apply clamping to the name element            
            clampText(name, 3);

            const price = document.createElement("h4");
            price.textContent = "$" + item.price;

            const stock = document.createElement("p");
            stock.textContent = item.stock > 0 ? "In stock" : "Out of stock";
            if (item.stock === 0) [
                stock.style.color = "red"
            ]

            const button = document.createElement("button");

            const shopContainer = document.getElementById('itemContainer');
            const cartContainer = document.getElementById('cartItems');

            // Check if appending to shop or cart display
            if (container === cartContainer) {
                itemDiv.appendChild(img);
                itemDiv.appendChild(name);
                itemDiv.appendChild(price);

                button.className = "cart-button";                
                const buttonText = document.createTextNode("Remove from Cart");
                button.appendChild(buttonText);
            }

            else if (container === shopContainer) {
                itemDiv.appendChild(img);
                itemDiv.appendChild(name);

                const descriptionPopup = document.createElement("div");
                descriptionPopup.classList.add("description-popup");
                descriptionPopup.innerHTML = `${item.description}<br><br><strong>Brand:</strong> ${item.distributor}<br><br><strong>Country:</strong> ${item.madeIn}<br><br><strong>Category:</strong> ${item.category}`;

                const viewDetailsButton = document.createElement("button");
                viewDetailsButton.classList.add("view-details");

                // Show the popup when the mouse hovers over the button
                viewDetailsButton.addEventListener("mouseover", () => {
                    showPopup(descriptionPopup);
                });

                // Hide the popup when the mouse leaves the button
                viewDetailsButton.addEventListener("mouseout", () => {
                    hidePopup(descriptionPopup);
                })

                // Show the popup when the mouse clicks on the button
                viewDetailsButton.addEventListener("click", () => {
                    showPopup(descriptionPopup);
                });

                // Hide the popup when the mouse hovers over the image
                img.addEventListener("mouseover", () => {
                    hidePopup(descriptionPopup);
                });

                itemDiv.appendChild(viewDetailsButton);
                itemDiv.appendChild(descriptionPopup);
                itemDiv.appendChild(price);
                itemDiv.appendChild(stock);

                button.className = "cart-button";
                const icon = document.createElement("img");
                icon.src = "/icons/cart.png";
                icon.alt = "Cart Icon";

                const buttonText = document.createTextNode("Add to Cart");

                // Append icon and text to button                
                button.appendChild(icon);
                button.appendChild(buttonText);
            }

            button.addEventListener("click", () => callbackFunc(item));

            itemDiv.appendChild(button);

            container.appendChild(itemDiv);
        });
    }
}

// Clamp text (if too long)
function clampText(element, lines) {
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
    const maxHeight = lineHeight * lines;
    element.style.overflow = 'hidden';
    element.style.textOverflow = 'ellipsis';
    element.style.display = '-webkit-box';
    element.style.webkitBoxOrient = 'vertical';
    element.style.webkitLineClamp = lines;
    element.style.maxHeight = `${maxHeight}px`;
}

// Function to show the popup
function showPopup(popup) {
    popup.style.display = 'block';
    popup.style.position = 'absolute';
}

// Function to hide the popup
function hidePopup(popup) {
    popup.style.display = 'none';
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