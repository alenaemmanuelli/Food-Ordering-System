const items = sessionStorage.length;
var orderNumber = 0;

//prints that this is the first order
console.log(`Order number ${orderNumber + 1}`)

//to be replaced with code that prints onto the DOM
//right now it is taking all of the orders from storage and printing to the console

//TODO
for(let itemNumber = 0; itemNumber <= sessionStorage.length; itemNumber++){
    // console.log(orderNumber)
    // console.log(itemNumber)
    //console.log(sessionStorage.getItem(`Order ${orderNumber} Item ${itemNumber}`) == 'end');
    
    //checks for "end" to denote the end of an order
    if(sessionStorage.getItem(`${orderNumber}${itemNumber}`) == "end"){
        console.log(`Order number ${orderNumber + 2}`);
        orderNumber++;
    }
    console.log(sessionStorage.getItem(`${orderNumber}${itemNumber}`))
}

