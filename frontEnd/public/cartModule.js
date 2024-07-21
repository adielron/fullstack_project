// Module for cart management

import { checkAuthentication } from './authenticationModule.js';

// Get cart items
export function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Check if the cart is empty
export function isCartEmpty() {
    let cart = getCart();
    return cart.length === 0;
}

// Add an item to the cart
export function addToCart(item) {
    let cart = getCart();
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    incrementCartItemCount();
    console.log('Item added to cart:', item);
    console.log('Cart:', cart);
}

// Remove an item from the cart
export function removeFromCart(itemToRemove) {
    let cart = getCart();    
    // Find the index of the first instance of the item to remove
    const itemIndex = cart.findIndex(item => item.name === itemToRemove.name);    
    if (itemIndex !== -1) {
        // Remove the first instance of the item
        cart.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        decrementCartItemCount();
        console.log('Item removed from cart:', itemToRemove);
        console.log('Cart:', cart);
        // Dispatch a custom event for item removal
        const event = new CustomEvent('itemRemoved');
        document.dispatchEvent(event);
    }   
}

// Increment cart item count
export function incrementCartItemCount() {
    let cartItemCount = localStorage.getItem("cartItemCount") ? parseInt(localStorage.getItem("cartItemCount")) : 0;  
    cartItemCount++;
    localStorage.setItem("cartItemCount", cartItemCount);
    displayCartItemCount();
}

// Decrement cart item count
export function decrementCartItemCount() {
    let cartItemCount = localStorage.getItem("cartItemCount") ? parseInt(localStorage.getItem("cartItemCount")) : 0; 
    if (cartItemCount > 0) {
        cartItemCount--;
    }    
    localStorage.setItem("cartItemCount", cartItemCount);
    displayCartItemCount();
}

// Reset cart item Count
export function resetCartItemCount() {
    localStorage.setItem("cartItemCount", 0);
    console.log("Cart item count reset to 0");
    displayCartItemCount();
}

// Reset cart
export function resetCart() {
    localStorage.removeItem("cart");
    console.log("Cart reset");
    resetCartItemCount();
    displayCartItemCount();
    // Dispatch a custom event for cart reset
    const event = new CustomEvent('cartReset');
    document.dispatchEvent(event);
}

// Display cart item count
export function displayCartItemCount() {
    checkAuthentication();
    let cartItemCount = localStorage.getItem("cartItemCount") ? parseInt(localStorage.getItem("cartItemCount")) : 0;
    const cartItemCountDisplay = document.getElementById("cartItemCount");
    if (cartItemCountDisplay) {
        if (cartItemCount > 0) {
            cartItemCountDisplay.textContent = cartItemCount;
            cartItemCountDisplay.style.display = "inline";
        } else {
            cartItemCountDisplay.style.display = "none";
        }
    }
}

// Handle purchase all button
export function setupPurchaseAllButton() {
    const purchaseAllButton = document.getElementById("purchaseAllButton");
    if (purchaseAllButton) {
        purchaseAllButton.addEventListener("click", purchaseAllItems);
    } else {
        console.error("purchaseAllButton not found");
    }
}

// Handle purchase all logic
function purchaseAllItems() {
    const cart = getCart();
    if (!cart.length) {
        alert("Your cart is empty!");
        return;
    }

    cart.forEach((item, index) => {
        const storedUser = localStorage.getItem("isAuthenticated");

        fetch("http://localhost:3000/purchases", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerId: storedUser,
                itemId: item._id,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to purchase item");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Item purchased successfully:", data);

            // Check if it's the last item to display the thank you message
            if (index === cart.length - 1) {
                const thankYouMessage = document.createElement("p");
                thankYouMessage.textContent = "Thank you for your purchase!";
                thankYouMessage.style.color = "green";
                document.body.appendChild(thankYouMessage);

                // Reset cart and reload
                resetCart();
            }
        })
        .catch((error) => {
            console.error("Error purchasing item:", error);
        });
    });

          // Reset cart and reload
          resetCart();          
}