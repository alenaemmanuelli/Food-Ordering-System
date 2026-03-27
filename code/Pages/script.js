
const form = document.getElementById("loginForm"); // Get the form element by its ID (assuming the form has an ID of "loginForm")

if (form) { // If the form exists, attach an event handler to its submit event

    form.onsubmit = function(event) { // Attach an event handler to the form's submit event
        event.preventDefault(); // Prevent the default form submission behavior (page refresh)
        const user = document.getElementById("user").value; // Get the value of the username input field
        const pass = document.getElementById("pass").value; // Get the value of the password input field
        const message = document.getElementById("loginMessage"); // Get the element where we will display messages to the user
        if (user === "" || pass === "") { // Check if either the username or password fields are empty
            message.textContent = "Please fill in all fields."; // If they are empty, display a message asking the user to fill in all fields
        } 
        else if (user === "employee" && pass === "1234") { // Check if the username is "employee" and the password is "1234"
            message.textContent = "Login successful."; // If the credentials are correct, display a success message
            window.location.href = "menu.html"; // Redirect the user to the menu.html page after successful login
        } 
        else {
            message.textContent = "Invalid login."; // If the credentials are incorrect, display an error message
        }
    };
}