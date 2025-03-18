document.addEventListener('DOMContentLoaded', function() {
    let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;

    if (!currentUser || !currentUser.username) {
        alert("No user signed in! Redirecting...");
        window.location.href = 'signin.html';
        return;
    }

    // Ensure `isStudent` is properly retrieved as a boolean
    const isStudent = localStorage.getItem('isStudent') === "true";

    // Update the admin name
    document.getElementById('admin-info').textContent = isStudent ? 
        `Student ${currentUser.username}` : `Admin ${currentUser.username}`;
});

// Logout Function
function setupEventListeners() {
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem("adminData");
        localStorage.removeItem("isStudent");
        localStorage.removeItem("isSignedIn");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("username");
       
        alert('Logging out...');
        window.location.href = "signin.html";
    });
}

document.addEventListener('DOMContentLoaded', setupEventListeners);
function logout() {
    localStorage.removeItem("adminData");
    localStorage.removeItem("isStudent");
    localStorage.removeItem("isSignedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("username");
    alert('Logging out...');
   
        window.location.href ="signin.html"
    localStorage.removeItem("userName");
   
}