document.addEventListener("DOMContentLoaded", function() {
    //Dashboard HTML References
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("order-id-input");
    const resultsDiv = document.getElementById("order-results");

    //Search Button clicked
    searchButton.addEventListener("click", function() {
        //Get order ID and clear any previous search results
        const orderId = searchInput.value.trim();
        resultsDiv.innerHTML = "";

        //no id entered
        if (orderId === "") {
            resultsDiv.textContent = "No ID Entered.";
            return;
        }
        // orders- retrives all stored orders, items- gets items for order id
        const orders = JSON.parse(localStorage.getItem("orders")) || {};
        const items = orders[orderId];
        // If Order doesn't exist or has no items
        if (!items || items.length === 0) {
            resultsDiv.textContent = `No Order found for ID: ${orderId}`;
            return;
        }

        //Order Results heading
        const heading = document.createElement("h3");
        heading.textContent = `Order #${orderId}`;
        resultsDiv.appendChild(heading);

        //Create a list and loop through items to add to list
        const list = document.createElement("ul");
        items.forEach(function (item) {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
        });
        //Add the list to the page
        resultsDiv.appendChild(list);
    });
});