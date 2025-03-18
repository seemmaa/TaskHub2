const sampleProjects = [
    { title: "Website Redesign", description: "Redesign the company website.", students: "Ibn Malik, Student 2", category: "Web Development", status: "Completed", progress: 100, startingDate: "2023-01-01", endingDate: "2025-06-01" },
    { title: "Mobile App Development", description: "Develop a mobile app.", students: "Student 3, Student 4", category: "Mobile Development", status: "In Progress", progress: 50, startingDate: "2023-02-15", endingDate: "2023-08-15" },
    { title: "Data Analysis Project", description: "Analyze company data.", students: "Student 5", category: "Data Science", status: "Pending", progress: 20, startingDate: "2023-03-01", endingDate: "2023-05-01" }
];

// Load Projects from Local Storage
function loadProjects() {
    let projects = JSON.parse(localStorage.getItem("projects")) || sampleProjects;
    localStorage.setItem("projects", JSON.stringify(projects));

}
function initializeFakeData() {
    // Check if data already exists in localStorage
    if (!localStorage.getItem("users") || !localStorage.getItem("projects") || !localStorage.getItem("tasks")) {
        // Define fake users
        const fakeUsers = [
            { username: "admin1", password: "admin123", isStudent: false, universityId: null }, // Admin
            { username: "student1", password: "student123", isStudent: true, universityId: "1001" }, // Student
            { username: "student2", password: "student123", isStudent: true, universityId: "1002" }, // Student
            { username: "student3", password: "student123", isStudent: true, universityId: "1003" } ,// Student
            { title: "Website Redesign", description: "Redesign the company website.", students: "Ibn Malik, Student 2", category: "Web Development", status: "Completed", progress: 100, startingDate: "2023-01-01", endingDate: "2025-06-01" },
            { title: "Mobile App Development", description: "Develop a mobile app.", students: "Student 3, Student 4", category: "Mobile Development", status: "In Progress", progress: 50, startingDate: "2023-02-15", endingDate: "2023-08-15" },
            { title: "Data Analysis Project", description: "Analyze company data.", students: "Student 5", category: "Data Science", status: "Pending", progress: 20, startingDate: "2023-03-01", endingDate: "2023-05-01" }
        ];

        // Define fake projects
        const fakeProjects = [
            {
                title: "E-commerce Platform",
                description: "Develop an online shopping platform.",
                students: "student1, student2", // Assigned students
                category: "Web Development",
                status: "In Progress",
                progress: 60,
                startingDate: "2023-09-01",
                endingDate: "2023-12-31"
            },
            {
                title: "AI Chatbot",
                description: "Build an AI-powered chatbot for customer support.",
                students: "student2, student3", // Assigned students
                category: "Artificial Intelligence",
                status: "Pending",
                progress: 20,
                startingDate: "2023-10-01",
                endingDate: "2024-02-28"
            },
            {
                title: "Data Visualization Dashboard",
                description: "Create a dashboard to visualize company data.",
                students: "student1, student3", // Assigned students
                category: "Data Science",
                status: "Completed",
                progress: 100,
                startingDate: "2023-07-01",
                endingDate: "2023-09-30"
            }
        ];

        // Define fake tasks
        const fakeTasks = [
            {
                taskId: 1,
                project: "E-commerce Platform",
                taskName: "Design User Interface",
                description: "Create wireframes and UI designs for the platform.",
                assignedStudent: "student1", // Assigned to a student
                status: "In Progress",
                dueDate: "2023-10-15"
            },
            {
                taskId: 2,
                project: "E-commerce Platform",
                taskName: "Implement Payment Gateway",
                description: "Integrate a payment gateway for transactions.",
                assignedStudent: "student2", // Assigned to a student
                status: "Pending",
                dueDate: "2023-11-01"
            },
            {
                taskId: 3,
                project: "AI Chatbot",
                taskName: "Train NLP Model",
                description: "Train a natural language processing model for the chatbot.",
                assignedStudent: "student2", // Assigned to a student
                status: "Pending",
                dueDate: "2023-10-20"
            },
            {
                taskId: 4,
                project: "Data Visualization Dashboard",
                taskName: "Deploy Dashboard",
                description: "Deploy the dashboard to the production server.",
                assignedStudent: "student3", // Assigned to a student
                status: "Completed",
                dueDate: "2023-09-25"
            }
        ];

        // Store fake data in localStorage
        localStorage.setItem("users", JSON.stringify(fakeUsers));
        localStorage.setItem("projects", JSON.stringify(fakeProjects));
        localStorage.setItem("tasks", JSON.stringify(fakeTasks));

        console.log("Fake data has been stored in localStorage.");
    } else {
        console.log("Data already exists in localStorage.");
    }
}



document.addEventListener('DOMContentLoaded', function () {
    initializeFakeData();
    loadProjects();
    const form = document.getElementById('signinForm');
    const errorMessage = document.getElementById('errorMessage');

    // Check if user is already signed in (if "Stay Signed In" was checked previously)
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true';
    if (isSignedIn) {
        window.location.href = 'home1.html';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
    
        // Get form values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const staySignedIn = document.getElementById('staySignedIn').checked;
    
        // Retrieve the list of users from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
    
        // Find a matching user
        const matchedUser = users.find(user => user.username === username && user.password === password);
    
        if (matchedUser) {
            // Save the full user object in localStorage
            localStorage.setItem('currentUser', JSON.stringify(matchedUser));
            
            // Save isStudent separately for easy access
            localStorage.setItem('isStudent', matchedUser.isStudent ? 'true' : 'false');
    
            if (staySignedIn) {
                localStorage.setItem('isSignedIn', 'true');
            }
    
            // Redirect to home page
            window.location.href = 'home1.html';
        } else {
            errorMessage.textContent = 'Invalid username or password!';
        }
    });
    
});
