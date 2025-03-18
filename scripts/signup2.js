document.addEventListener('DOMContentLoaded', function () {

    
    const form = document.getElementById('signupForm');
    const isStudentCheckbox = document.getElementById('isStudent');
    const universityIdGroup = document.getElementById('universityIdGroup');

    // Check if the student checkbox was previously checked
    const savedIsStudent = localStorage.getItem('isStudent') === 'true';
    if (savedIsStudent) {
        isStudentCheckbox.checked = true;
        universityIdGroup.style.display = 'block';
    }

    // Toggle university ID field visibility based on checkbox
    isStudentCheckbox.addEventListener('change', function () {
        universityIdGroup.style.display = this.checked ? 'block' : 'none';
    });

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const isStudent = isStudentCheckbox.checked;
        const universityId = document.getElementById('universityId').value;

        // Retrieve existing users from localStorage (or create empty array if none exist)
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if username already exists
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            alert('Username already exists. Please choose another one.');
            return;
        }

        // Create new user object
        const newUser = {
            username,
            password, // Note: Never store passwords in plaintext (use hashing in real apps)
            isStudent,
            universityId: isStudent ? universityId : null
        };

        // Add new user to array
        users.push(newUser);

        // Save updated users array back to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Optional: Show success message
        alert('Sign up successful!');
        window.location.href = "signin.html";

        // Optional: Reset form
        form.reset();
        universityIdGroup.style.display = 'none';
    });
});
