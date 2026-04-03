// Default stock amount given to each item on first load
const DEFAULT_QUANTITY = 10;

// List of all menu items tracked in inventory
const ITEM_NAMES = [
    "Item 1", "Item 2", "Item 3",
    "Item 4", "Item 5", "Item 6",
    "Item 7", "Item 8", "Item 9"
];

// Runs when the page finishes loading
document.addEventListener("DOMContentLoaded", function () {

    // Send non-employees back to the login page
    if (sessionStorage.getItem("loggedIn") !== "true") {
        alert("You must be logged in to access the Inventory Tracker.");
        window.location.href = "../Login/login.html";
        return;
    }

    // Load saved inventory, or start fresh if none exists
    var inventory = JSON.parse(localStorage.getItem("inventory")) || {};

    // Give any missing items their default starting quantity
    var changed = false;
    ITEM_NAMES.forEach(function (name) {
        if (inventory[name] === undefined) {
            inventory[name] = DEFAULT_QUANTITY;
            changed = true;
        }
    });

    // Save back only if something was added
    if (changed) {
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    renderInventory(inventory);
});

// Builds the inventory table rows from the current inventory data
function renderInventory(inventory) {
    var tableBody = document.getElementById("inventory-body");
    tableBody.innerHTML = ""; // Clear old rows before redrawing

    ITEM_NAMES.forEach(function (itemName) {
        var quantity = inventory[itemName] !== undefined ? inventory[itemName] : DEFAULT_QUANTITY;

        // Determine stock status label and color class
        var isOutOfStock = quantity <= 0;
        var statusText = isOutOfStock ? "Out of Stock" : "In Stock";
        var statusClass = isOutOfStock ? "status-out" : "status-in";

        // Create a row with the item name, quantity input, status, and update button
        var row = document.createElement("tr");
        row.innerHTML =
            "<td>" + itemName + "</td>" +
            "<td><input type='number' class='quantity-input' data-item='" + itemName + "' value='" + quantity + "' min='0' style='width:70px;'></td>" +
            "<td class='" + statusClass + "'>" + statusText + "</td>" +
            "<td><button class='update-btn btn' data-item='" + itemName + "'>Update</button></td>";
        tableBody.appendChild(row);
    });

    // Attach a click listener to each Update button
    document.querySelectorAll(".update-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var itemName = btn.dataset.item;
            var input = document.querySelector(".quantity-input[data-item='" + itemName + "']");
            var newQty = parseInt(input.value);

            // Reject invalid input
            if (isNaN(newQty) || newQty < 0) {
                alert("Please enter a valid quantity (0 or more).");
                return;
            }

            // Save the new quantity and refresh the table
            var inventory = JSON.parse(localStorage.getItem("inventory")) || {};
            inventory[itemName] = newQty;
            localStorage.setItem("inventory", JSON.stringify(inventory));
            renderInventory(inventory);
        });
    });
}
