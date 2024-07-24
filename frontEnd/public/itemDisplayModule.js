// Module for item display

import { getCart, addToCart, removeFromCart } from './cartModule.js';
import { renderGraphs } from './statisticsModule.js';

// Get items from the database and display them
export async function fetchItems() {
    try {
        const response = await fetch("http://localhost:3000/items");
        const items = await response.json();
        const itemContainer = document.getElementById("itemContainer");
        displayItems(items, itemContainer, addToCart);
        //renderGraphs(items);
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

// Display items with container parameter
export async function displayItems(items, container, callbackFunc) {
    container.innerHTML = "";

    items.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.name;

        const name = document.createElement("h3");
        name.textContent = item.name;

        const description = document.createElement("p");
        description.textContent = item.description;

        const price = document.createElement("p");
        price.textContent = "Price: $" + item.price;

        const stock = document.createElement("p");
        if (item.stock > 0) {
            stock.textContent = "In stock";
        }
        else stock.textContent = "Out of stock";        

        const country = document.createElement("p");
        country.textContent = "Country: " + item.madeIn;

        const category = document.createElement("p");
        category.textContent = "Category: " + item.category;

        const button = document.createElement("button");
        if (callbackFunc === addToCart) {
            button.textContent = "Add to Cart";
        } else {
            button.textContent = "Remove from Cart";
        }
        button.addEventListener("click", () => callbackFunc(item));

        itemDiv.appendChild(img);
        itemDiv.appendChild(name);
        itemDiv.appendChild(description);
        itemDiv.appendChild(price);
        itemDiv.appendChild(stock);
        itemDiv.appendChild(country);
        itemDiv.appendChild(category);
        itemDiv.appendChild(button);

        container.appendChild(itemDiv);
    });
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