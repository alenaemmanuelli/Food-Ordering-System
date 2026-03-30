// cart object, session only
const cart = {};

// DOM references
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const orderButton = document.getElementById('order-button');

// function to format & display numbers correctly
function format(amount){
    return '$' + amount.toFixed(2); // to 2 decimal places
}

// updates the cart as the user edits it
function renderCart(){
    const items = Object.values(cart); // array of items


}
