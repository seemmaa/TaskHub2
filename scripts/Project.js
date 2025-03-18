function getSelectedStudents() {
    const selectedStudents = [];
    document.querySelectorAll(".students-list p.selected").forEach(p => {
        selectedStudents.push(p.textContent);
    });
    return selectedStudents;
}
// Store user information
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

   

    // Get isStudent status
    const isStudent = localStorage.getItem('isStudent') === 'true';

    // Update admin name
    document.getElementById('userDisplay').textContent = isStudent 
        ? `Student ${currentUser.username}` 
        : `Admin ${currentUser.username}`;

// Toggle Sidebar
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("collapsed");
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

// Load Dark Mode Preference
document.addEventListener("DOMContentLoaded", () => {
    
        document.body.classList.add("dark-mode");
    
    loadProjects();  // FIXED: Ensure projects load on page load
    handleRouting(); // Handle SPA navigation
   // displayProjects();
});

// Logout function for SPA
function logout() {
    localStorage.removeItem("adminData");
    localStorage.removeItem("isStudent");
    localStorage.removeItem("isSignedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("username");
    alert('Logging out...');
   window.location.href ="signin.html"
    localStorage.removeItem("userName");
   // navigateTo("signin"); 
}

// Function to handle SPA routing
function navigateTo(page) {
    window.location.hash = page;
}

// Handle hash-based navigation
function handleRouting() {
    const page = window.location.hash.replace("#", "") || "dashboard"; // Default to dashboard
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    const activePage = document.getElementById(page);
    if (activePage) {
        activePage.style.display = "block";
    }
}

// Listen for URL hash changes (SPA Navigation)
window.addEventListener("hashchange", handleRouting);

// Sample Projects Data
const sampleProjects = [
    { title: "Website Redesign", description: "Redesign the company website.", students: "Ibn Malik, Student 2", category: "Web Development", status: "Completed", progress: 100, startingDate: "2023-01-01", endingDate: "2025-06-01" },
    { title: "Mobile App Development", description: "Develop a mobile app.", students: "Student 3, Student 4", category: "Mobile Development", status: "In Progress", progress: 50, startingDate: "2023-02-15", endingDate: "2023-08-15" },
    { title: "Data Analysis Project", description: "Analyze company data.", students: "Student 5", category: "Data Science", status: "Pending", progress: 20, startingDate: "2023-03-01", endingDate: "2023-05-01" }
];

// Load Projects from Local Storage
function loadProjects() {
    let projects = JSON.parse(localStorage.getItem("projects")) || sampleProjects;
    localStorage.setItem("projects", JSON.stringify(projects));
    displayProjects(projects);
}

// Display Projects
function displayProjects(projects) {

    const grid = document.getElementById("projectsGrid");
    grid.innerHTML = "";

    projects.forEach(project => {
        let card = document.createElement("div");
        card.className = "project-card";

        // Determine border color based on status
        let borderColor = {
            "pending": "#8a5c1a",
            "in progress": "#3f8842",
            "completed": "#225e8d"
        }[project.status.toLowerCase()] || "gray";

        card.style.border = `2px solid ${borderColor}`;

        card.innerHTML = `
            <h3 class="project-title">${project.title}</h3>
            <p><strong>Description:</strong> ${project.description}</p>
            <p><strong>Students:</strong> ${project.students}</p>
            <p><strong>Category:</strong> ${project.category}</p>
            <div class="progress-bar"> 
                <div class="progress" style="width: ${project.progress}%">
                  <span class="progress-text">${project.progress}%</span> 
                </div>
            </div>
            <div class="project-dates">
              <span class="start-d">${project.startingDate}</span>
              <span class="end-d">${project.endingDate}</span>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Filter Projects by Status
document.getElementById("dropdownMenu").addEventListener("click", function (event) {
    console.log("dropdown clicked");
    let projects = JSON.parse(localStorage.getItem("projects")) || sampleProjects;
    let target = event.target.closest("li");
    if (!target) return;
    let filter = target.getAttribute("data-value");
    let filteredProjects = filter === "all" ? projects : projects.filter(p => p.status.toLowerCase() === filter.toLowerCase());
    displayProjects(filteredProjects);
});

// Search Projects
document.getElementById("search").addEventListener("input", function () {
    let projects = JSON.parse(localStorage.getItem("projects"));
    let query = this.value.toLowerCase();
    let filteredProjects = projects.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    displayProjects(filteredProjects);
});

// Add Fake Project
function addFakeProject() {
    let projects = JSON.parse(localStorage.getItem("projects"));
    projects.push({
        title: "New Project",
        description: "This is a new fake project.",
        students: "Student X",
        category: "Random",
        status: "In Progress",
        progress: 20,
        startingDate: "2025-2-3",
        endingDate: "2025-3-3"
    });
    localStorage.setItem("projects", JSON.stringify(projects));
    displayProjects(projects);
}

// Dropdown & Status Selection - FIXED
document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggle = document.getElementById('dropdownToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const selectedStatusText = document.getElementById('selectedStatus');
    const statusItems = dropdownMenu.querySelectorAll('li');

    dropdownToggle.addEventListener('click', function (event) {
        console.log("clicked");
        event.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', function (event) {
        if (!dropdownMenu.contains(event.target) && !dropdownToggle.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    statusItems.forEach(item => {
        item.addEventListener('click', function () {
            statusItems.forEach(statusItem => {
                statusItem.classList.remove('selected');
                statusItem.querySelector('.check-icon').classList.add('hidden');
            });
            this.classList.add('selected');
            this.querySelector('.check-icon').classList.remove('hidden');
            selectedStatusText.textContent = this.querySelector('span').textContent;
            dropdownMenu.classList.remove('show');

            // Filter Projects on Selection
            let filter = this.getAttribute("data-value");
            let projects = JSON.parse(localStorage.getItem("projects")) || sampleProjects;
            let filteredProjects = filter === "all" ? projects : projects.filter(p => p.status.toLowerCase() === filter.toLowerCase());
            displayProjects(filteredProjects);
        });
    });

    // Load projects on initial page load
    loadProjects();
});

function handleRouting() {
    const page = window.location.hash.replace("#", "") || "dashboard"; // Default to dashboard
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    
    const activePage = document.getElementById(page);
    if (activePage) {
        activePage.style.display = "block";
        
        // Reattach dropdown event listener if navigating to the projects page
        if (page === "Project") {
            setupDropdownEvents();
        }
    }
}


// Function to get the selected status from the dropdown
function getSelectedStatus() {
    const statusDropdown = document.getElementById("modalStatusDropdown");
    if (!statusDropdown) {
        console.error("Dropdown element not found!");
        return null;
    }
    return statusDropdown.value; // Returns the value of the selected option
}
console.log("Selected Status:", getSelectedStatus());

function setupDropdownEvents() {
    console.log("Setting up dropdown events"); // Debugging

    const dropdownToggle = document.getElementById("dropdownToggle");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (!dropdownToggle || !dropdownMenu) {
        console.warn("Dropdown elements not found");
        return;
    }

    dropdownToggle.addEventListener("click", function (event) {
        console.log("Dropdown clicked");
        event.stopPropagation();
        dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", function (event) {
        if (!dropdownMenu.contains(event.target) && !dropdownToggle.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });

    dropdownMenu.addEventListener("click", function (event) {
        let target = event.target.closest("li");
        if (!target) return;
        console.log("Filter item clicked:", target);

        let filter = target.getAttribute("data-value");
        let projects = JSON.parse(localStorage.getItem("projects")) || sampleProjects;
        let filteredProjects = filter === "all" ? projects : projects.filter(p => p.status.toLowerCase() === filter.toLowerCase());
        
        displayProjects(filteredProjects);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const addProjectBtn = document.querySelector(".add-btn"); // Add Project button
    const projectsGrid = document.getElementById("projectsGrid"); // Project container
    const modal = document.getElementById("projectModal"); // Modal
    const closeModalBtn = document.querySelector(".close-btn"); // Close button

    function openModal() {
        const isStudent = localStorage.getItem('isStudent') === 'true';
        if(!isStudent){

        modal.style.display = "block";}
        else{
            alert("You dont have permission to add new project");
        }
    }

    function closeModal() {
        modal.style.display = "none";
    }

    
    
    // Add New Project
    function addNewProject() {
        // Get user inputs
        const title = document.getElementById("projectTitle").value;
        const description = document.getElementById("projectDescription").value;
        const category = document.querySelector("select").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const status = getSelectedStatus();
    
        // Get selected students from localStorage
        const selectedStudents = JSON.parse(localStorage.getItem("selectedStudents")) || [];
    
        // Ensure title, description, and at least one student are provided
        if (!title.trim() || !description.trim() || selectedStudents.length === 0) {
            alert("Title, description, and at least one student are required!");
            return;
        }
    
        // Calculate progress based on start and end dates
        const progress = calculateProgress(startDate, endDate);
    
        // Add the new project to the localStorage list of projects
        let projects = JSON.parse(localStorage.getItem("projects")) || [];
        projects.push({
            title: title,
            description: description,
            students: selectedStudents.join(", "),
            category: category,
            status: status,
            progress: progress, // Dynamically calculated progress
            startingDate: startDate,
            endingDate: endDate
        });
        localStorage.setItem("projects", JSON.stringify(projects));
    
        // Close modal after adding project
        closeModal();
    
        // Clear input fields after adding
        document.querySelector("input[type='text']").value = "";
        document.querySelector("textarea").value = "";
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
    
        // Refresh project display
        displayProjects(projects);
    }
    
    // Event Listeners
    document.addEventListener("DOMContentLoaded", function () {
        // Load students from local storage and populate the list
        loadStudents();
    
        // Add event listener for adding a new project
        const addProjectBtn = document.querySelector(".add-btn"); // Add Project button
        const closeModalBtn = document.querySelector(".close-btn"); // Close button for the modal
        addProjectBtn.addEventListener("click", addNewProject);
        closeModalBtn.addEventListener("click", closeModal);
        window.openModal = openModal;
    });
    
    // Event Listeners
    addProjectBtn.addEventListener("click", addNewProject);
    closeModalBtn.addEventListener("click", closeModal);
    window.openModal = openModal;
});

function initializeStudents() {
    if (!localStorage.getItem("students")) { 
        const fakeStudents = ["Student 1", "Student 2", "Student 3", "Student 4", "Student 5"];
        localStorage.setItem("students", JSON.stringify(fakeStudents));
    }
}

// Function to load students from local storage and populate the list
function loadStudents() {
    const studentsList = document.querySelector(".students-list");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const studentUsers = users.filter(user => user.isStudent === true);
    // Clear existing list
    studentsList.innerHTML = "";

    // Populate student list dynamically
    studentUsers.forEach(student => {
        let studentElement = document.createElement("p");
        studentElement.textContent = student.username;

        // Add click event to toggle selection
        studentElement.addEventListener("click", () => {
            studentElement.classList.toggle("selected");
            const selectedStatus=getSelectedStatus();
            localStorage.setItem("selectedStatus", JSON.stringify(selectedStatus));
            // Save selected students to localStorage
            const selectedStudents = getSelectedStudents();
            localStorage.setItem("selectedStudents", JSON.stringify(selectedStudents));
        });

        studentsList.appendChild(studentElement);
    });

    // Restore previously selected students
    const selectedStudents = JSON.parse(localStorage.getItem("selectedStudents")) || [];
    document.querySelectorAll(".students-list p").forEach(p => {
        if (selectedStudents.includes(p.textContent)) {
            p.classList.add("selected");
        }
    });
}

// Run functions when page loads

// Run functions when page loads
document.addEventListener("DOMContentLoaded", () => {
    initializeStudents(); // Store fake students if not already present
    loadStudents(); // Load students from local storage
});

function calculateProgress(startDate, endDate) {
    const today = new Date(); // Current date
    const start = new Date(startDate); // Project start date
    const end = new Date(endDate); // Project end date

    // Ensure valid dates
    if (isNaN(start) || isNaN(end)) {
        console.error("Invalid start or end date");
        return 0; // Default progress if dates are invalid
    }

    // Calculate total duration in milliseconds
    const totalDuration = end - start;

    // Calculate elapsed time in milliseconds
    const elapsedTime = today - start;

    // Calculate progress percentage
    let progress = (elapsedTime / totalDuration) * 100;

    // Ensure progress is between 0 and 100
    progress = Math.max(0, Math.min(100, progress));

    return Math.round(progress); // Round to the nearest integer
}