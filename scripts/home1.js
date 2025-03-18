// Initialize localStorage data if not exists
function initializeLocalStorage() {
    if (!localStorage.getItem('adminData')) {
        const adminData = {
            name: localStorage.getItem("isStudent")? `Student ${localStorage.getItem('username')}`:`Admin ${localStorage.getItem('username')}`,
            stats: {
                projects: 5,
                students: 20,
                tasks: 10,
                finishedProjects: 2
            },
            chartData: {
                labels: ['Projects', 'Students', 'Tasks', 'Finished'],
                values: [5, 20, 10, 2]
            }
        };
        localStorage.setItem('adminData', JSON.stringify(adminData));
    }
    
}

// Load data from localStorage
function loadData() {
    // Get the signed-in user
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert("No user signed in! Redirecting...");
        window.location.href = 'signin.html';
        return;
    }

    // Get isStudent status
    const isStudent = localStorage.getItem('isStudent') === 'true';

    // Update admin name
    document.getElementById('admin-name').textContent = isStudent 
        ? `Student ${currentUser.username}` 
        : `Admin ${currentUser.username}`;

    // Retrieve or initialize admin data
    let adminData = JSON.parse(localStorage.getItem('adminData'));
    if (!adminData) {
        adminData = {
            name: isStudent ? `Student ${currentUser.username}` : `Admin ${currentUser.username}`,
            stats: { projects: 5, students: 20, tasks: 10, finishedProjects: 2 },
            chartData: { labels: ['Projects', 'Students', 'Tasks', 'Finished'], values: [5, 20, 10, 2] }
        };
        localStorage.setItem('adminData', JSON.stringify(adminData));
    }

    // Set statistics
    document.getElementById('projects-count').textContent = adminData.stats.projects;
    
    if (isStudent) {
        document.getElementById('studentNumDiv').style.display = "none"; // Hide students section
    } else {
        document.getElementById('students-count').textContent = adminData.stats.students;
    }

    document.getElementById('tasks-count').textContent = adminData.stats.tasks;
    document.getElementById('finished-projects-count').textContent = adminData.stats.finishedProjects;

    // Update date and time
    updateDateTime();

    // Initialize chart
    initializeChart(adminData.chartData);
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const formattedDateTime = now.toLocaleDateString('en-US', options)
        .replace(',', '')
        .replace(/(\d+):(\d+):(\d+)/, '$1:$2:$3');
    
    document.getElementById('current-datetime').textContent = formattedDateTime;
    
    // Update every second
    setTimeout(updateDateTime, 1000);
}

// Initialize chart
// Initialize chart
function initializeChart(chartData) {
    const ctx = document.getElementById('dashboard-chart').getContext('2d');

    // Check if the user is a student
    const isStudent = localStorage.getItem('isStudent') === 'true';

    // Remove 'Students' from labels and values if isStudent is true
    let filteredLabels = [];
    let filteredValues = [];
    let filteredColors = [];
    let filteredBorderColors = [];

    const allColors = ['#2c7873', '#1e5f74', '#c6a700', '#6b2d5c']; // Colors for bars
    const allBorderColors = ['#2c7873', '#1e5f74', '#c6a700', '#6b2d5c']; // Border colors

    chartData.labels.forEach((label, index) => {
        if (!(isStudent && label === 'Students')) {
            filteredLabels.push(label);
            filteredValues.push(chartData.values[index]);
            filteredColors.push(allColors[index]);
            filteredBorderColors.push(allBorderColors[index]);
        }
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: filteredLabels,
            datasets: [{
                label: 'Count',
                data: filteredValues,
                backgroundColor: filteredColors,
                borderColor: filteredBorderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#aaa'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#aaa'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#aaa',
                        boxWidth: 15,
                        padding: 10
                    }
                }
            }
        }
    });
}

// Handle logout button
function setupEventListeners() {
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem("adminData");
        localStorage.removeItem("isStudent");
        localStorage.removeItem("isSignedIn");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("username");
        alert('Logging out...');
        window.location.href ="signin.html"
        
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeLocalStorage();
    loadData();
    setupEventListeners();
});