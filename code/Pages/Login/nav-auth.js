// Conditional rendering for Dashboard w/o react 
if (sessionStorage.getItem("loggedIn") === "true") {
    document.body.classList.add("logged-in");
}
