// cart object, session only
const cart = {};

// Inventory helpers
var INVENTORY_ITEMS = [
    "Item 1", "Item 2", "Item 3",
    "Item 4", "Item 5", "Item 6",
    "Item 7", "Item 8", "Item 9"
];

function initInventory() {
    var inventory = JSON.parse(localStorage.getItem("inventory")) || {};
    var changed = false;
    INVENTORY_ITEMS.forEach(function (name) {
        if (inventory[name] === undefined) {
            inventory[name] = 10;
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }
}

// Disables "Add to Cart" for items with 0 stock
function checkStockOnMenu() {
    var inventory = JSON.parse(localStorage.getItem("inventory")) || {};
    var menuItems = document.getElementsByClassName("menu-item");
    for (var i = 0; i < menuItems.length; i++) {
        var item = menuItems[i];
        var name = item.dataset.name;
        var btn = item.getElementsByClassName("add-button")[0];
        var qty = (inventory[name] !== undefined) ? inventory[name] : 10;
        if (qty <= 0) {
            btn.disabled = true;
            btn.textContent = "Out of Stock";
        } else {
            btn.disabled = false;
            btn.textContent = "Add to Cart";
        }
    }
}
//let orderNumber = parseInt(localStorage.getItem("orderNumber")) || 0;
//let itemNumber = parseInt(localStorage.getItem("itemNumber")) || 0;

// DOM references
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const orderButton = document.getElementById('order-button');

//Check if document is finished loading before allowing cart to be changed
if (document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded' , ready);
}

else{
    ready();
}

//listeners for button presses
function ready(){
    initInventory();
    checkStockOnMenu();

    //activates addToCart function
    var addToCartButtons = document.getElementsByClassName('add-button');
    for(var i = 0; i< addToCartButtons.length; i++){
        var button = addToCartButtons[i];
        button.addEventListener('click',addToCart)
    }
    
    //activates removeCartItem function
    var removeCartItemButton = document.getElementsByClassName('btn-delete');
    for (var i = 0 ; i < removeCartItemButton.length; i++){
        var button = removeCartItemButton[i];
        button.addEventListener('click', removeCartItem)
    }

    //activates quantityChanged function
    var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for(var i = 0 ;i < quantityInputs.length ; i++){
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    //activates the purchaseClicked function
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

//gets information to add item to cart
function addToCart(event) {
    var button = event.target;
    var shopItem = button.parentElement;
    var title = shopItem.dataset.name;
    var price = shopItem.dataset.price;

    // Block adding out-of-stock items
    var inventory = JSON.parse(localStorage.getItem("inventory")) || {};
    var qty = (inventory[title] !== undefined) ? inventory[title] : 10;
    if (qty <= 0) {
        alert(title + " is out of stock and cannot be added to the cart.");
        return;
    }

    addItemToCart(title, price);
    updateCartTotal();
}

//adds the item into the cart
function addItemToCart(title, price){
    var cartRow = document.createElement('tr');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');

    for (i = 0; i< cartItemNames.length ; i++){
        if(cartItemNames[i].innerText == title){
            alert('This item already has added to the cart!');
            return
        }
    }

    //structure of the html to be added to the DOM
    var cartRowContents = `

        <td class="cart-item cart-column">
            <span class="cart-item-title">${title}</span>                  
        </td>
        <td class="cart-item cart-column">
            <span class="cart-price cart-column">${price}</span>
        </td>
        <td class="cart-item cart-column">
            <input class="cart-quantity-input" type="number" value="1" style="width: 50px">
            <button class="btn btn-delete" type="button">Remove</button>
        </td>        
    `;
     
            
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-delete')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

//removes item from cart
function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
    
}

//gets the quantity of items, and ensures that it remains a number
function  quantityChanged(event){
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0 ){
        input.value = 1;
    }
    updateCartTotal();
}

//updates the total when quantity is changed
function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    for (var i = 0 ; i< cartRows.length ; i++){
        var cartRow =cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText.replace('$' , ''))
        var quantity = quantityElement.value;
        total = total + (price * quantity);
         
    }
    //ensures that only 2 decimal places show
    total = Math.round(total * 100 )/100;
    document.getElementsByClassName('cart-total-price')[0].innerText = '$'+ total;
 
}

// Saves cart to localStorage and deducts inventory
function purchaseClicked() {
    var cartItemsEl = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemsEl.getElementsByClassName('cart-row');

    if (cartRows.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Read all cart items and quantities before modifying the DOM
    var orderItems = [];
    for (var i = 0; i < cartRows.length; i++) {
        var name = cartRows[i].getElementsByClassName('cart-item-title')[0].innerText;
        var qty = parseInt(cartRows[i].getElementsByClassName('cart-quantity-input')[0].value);
        orderItems.push({ name: name, qty: qty });
    }

    // Check inventory for each item
    var inventory = JSON.parse(localStorage.getItem("inventory")) || {};
    var insufficient = [];
    orderItems.forEach(function (item) {
        var available = (inventory[item.name] !== undefined) ? inventory[item.name] : 10;
        if (available < item.qty) {
            insufficient.push(item.name + " (available: " + available + ", requested: " + item.qty + ")");
        }
    });

    if (insufficient.length > 0) {
        alert("Cannot place order. Insufficient stock for:\n" + insufficient.join("\n") + "\n\nPlease update your cart.");
        return;
    }

    // Deduct inventory quantities
    orderItems.forEach(function (item) {
        var current = (inventory[item.name] !== undefined) ? inventory[item.name] : 10;
        inventory[item.name] = current - item.qty;
    });
    localStorage.setItem("inventory", JSON.stringify(inventory));

    // Save order
    var orders = JSON.parse(localStorage.getItem("orders")) || {};
    var orderNumber = parseInt(localStorage.getItem("orderNumber")) || 0;
    var itemNames = orderItems.map(function (item) { return item.name; });
    orders[orderNumber] = itemNames;
    localStorage.setItem("orders", JSON.stringify(orders));
    orderNumber++;
    localStorage.setItem("orderNumber", orderNumber);

    // Clear the cart DOM
    while (cartItemsEl.hasChildNodes()) {
        cartItemsEl.removeChild(cartItemsEl.firstChild);
    }

    updateCartTotal();
    checkStockOnMenu();
    alert("Thank you for your purchase! Your order number is " + (orderNumber - 1) + ".");
}