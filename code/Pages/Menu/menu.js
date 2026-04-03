// cart object, session only
const cart = {};
let orderNumber = 0;
let itemNumber = 0;

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
    console.log(title, price) //TESTING
    addItemToCart(title,price);
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

//delete items from the cart and save them to sessionStorage
 function purchaseClicked(){
     alert('Thank you for your purchase!');
     var cartItems = document.getElementsByClassName('cart-items')[0];
     var cartItemNames = cartItems.getElementsByClassName('cart-item-title');

     while(cartItems.hasChildNodes()){
        console.log("currently in cartItems array: " + cartItemNames[0].innerText) //testing
        sessionStorage.setItem(`${orderNumber}${itemNumber}`, cartItemNames[0].innerText)
        cartItems.removeChild(cartItems.firstChild)
        console.log("what is being saved: " + sessionStorage.getItem(`${orderNumber}${itemNumber}`)) //testing
        itemNumber++;
     }
     //this marks the end of this order
     sessionStorage.setItem(`${orderNumber}${itemNumber}`, "end")
     orderNumber++;
     updateCartTotal();     
 }