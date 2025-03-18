function initializeLocalStorage() {
   

    if (!localStorage.getItem("students")) {
        const students = [
            "Ali Yaseen",
            "Braa Aeesh",
            "Ibn AL-Jawzee",
            "Ibn Malik",
            "Ayman Outom",
            "Salah Salah",
            "Yahya Leader",
            "Salam Kareem",
            "Isaac Nasir",
            "Saeed Salam"
        ];
        localStorage.setItem("students", JSON.stringify(students));
    }
}
const tasks = JSON.parse(localStorage.getItem('tasks')) || [
    {
        taskId: 1,
        project: "Website Redesign",
        taskName: "Design Homepage",
        description: "Create a responsive design for the homepage.",
        assignedStudent: "Ali Yaseen",
        status: "In Progress",
        dueDate: "4/22/2023"
    },
    {
        taskId: 2,
        project: "Website Redesign",
        taskName: "Develop API",
        description: "Set up the backend API for the project.",
        assignedStudent: "Brae Aeesh",
        status: "Completed",
        dueDate: "1/16/2023"
    },
    {
        taskId: 3,
        project: "Mobile App Development",
        taskName: "Write Documentation",
        description: "Document the project setup and usage.",
        assignedStudent: "Ibn Al-Jawzee",
        status: "Pending",
        dueDate: "3/15/2023"
    },
    {
        taskId: 4,
        project: "Mobile App Development",
        taskName: "Testing",
        description: "Conduct testing for all features.",
        assignedStudent: "Ibn Malik",
        status: "In Progress",
        dueDate: "11/29/2023"
    },
    {
        taskId: 5,
        project: "E-commerce Platform",
        taskName: "Deploy Application",
        description: "Deploy the application to the production server.",
        assignedStudent: "Ayman Outom",
        status: "Pending",
        dueDate: "3/24/2023"
    }
];


if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTasks() {
    const taskTableBody = document.getElementById('task-table-body');
    taskTableBody.innerHTML = ''; 

    // Retrieve projects and tasks from localStorage
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Get the current student's name from localStorage
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Ensure currentUser exists before proceeding
    if (!currentUser || !currentUser.username) {
        console.error("Current user not found in localStorage.");
        return;
    }

    // Find projects where the student is enrolled
    const enrolledProjects = projects.filter(project =>
        project.students.split(',').includes(currentUser.username)
    );

    // Extract project names (assuming project.title is unique)
    const enrolledProjectTitles = enrolledProjects.map(project => project.title);
    console.log(enrolledProjectTitles);
    // Filter tasks that belong to enrolled projects
   let savedTasks=[];
    const isStudent = localStorage.getItem('isStudent') === 'true';
    if(isStudent){
   savedTasks = allTasks.filter(task =>
        enrolledProjectTitles.includes(task.project)
    );}
    else{
       savedTasks = allTasks;
        
    }

    // Render tasks in the table
    savedTasks.forEach((task) => {
        const row = document.createElement('tr');
        row.setAttribute('data-task-id', task.taskId); 

        let statusClass = '';
        if (task.status === 'Completed') {
            statusClass = 'completed';
        } else if (task.status === 'In Progress') {
            statusClass = 'in-progress';
        } else if (task.status === 'Pending') {
            statusClass = 'pending';
        }

        row.innerHTML = `
            <td>${task.taskId}</td>
            <td>${task.project}</td>
            <td>${task.taskName}</td>
            <td>${task.description}</td>
            <td>${task.assignedStudent}</td>
            <td class="${statusClass}">${task.status}</td>
            <td>${task.dueDate}</td>
        `;

        taskTableBody.appendChild(row);
    });
}



window.onload = renderTasks;




document.addEventListener("DOMContentLoaded", function() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert("No user signed in! Redirecting...");
        window.location.href = 'signin.html';
        return;
    }

    // Get isStudent status
    const isStudent = localStorage.getItem('isStudent') === 'true';

    // Update admin name
    document.getElementById('user').textContent = isStudent 
        ? `Student ${currentUser.username}` 
        : `Admin ${currentUser.username}`;

    const addTaskButton = document.getElementById("addTask");
    document.getElementById('dueDate').addEventListener('change', function() {
        console.log("Date selected:", this.value);
    });
    addTaskButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent page refresh

        const taskName = document.getElementById('taskName').value;
        const project = document.getElementById('projectTitle').value;
        const assignedStudent = document.getElementById('assignedStudent').value;
        const status = document.getElementById('status').value;
        const dueDate = document.getElementById('dueDate').value;
        const description =document.getElementById('description').value;
        console.log("duedate:"+dueDate);

        if ( !dueDate) {
            alert("All fields are required!");
            return; 
        }

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        const taskId = tasks.length ? tasks[tasks.length - 1].taskId + 1 : 1;

        const newTask = {
            taskId,
            project,
            taskName,
            description, // Ensure this is handled correctly
            assignedStudent,
            status,
            dueDate
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addTaskForm=document.getElementById("taskModal");
        renderTasks(); // Update UI
        closeModal()
        //addTaskForm.reset(); // Clear form after submission
    });

    renderTasks(); // Ensure tasks are displayed on page load
});



document.getElementById('sortBy').addEventListener('change', function() {
    const sortBy = this.value;
    let sortedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    switch (sortBy) {
        case 'Task Status':
            sortedTasks.sort((a, b) => a.status.localeCompare(b.status));
            break;
        case 'Projects':
            sortedTasks.sort((a, b) => a.project.localeCompare(b.project));
            break;
        case 'Assigned Student':
            sortedTasks.sort((a, b) => a.assignedStudent.localeCompare(b.assignedStudent));
            break;
        case 'Due Date':
            sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            break;
            
    }

    localStorage.setItem('tasks', JSON.stringify(sortedTasks)); 
    renderTasks(); 
});

function deleteTask(taskId) {
    let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks = savedTasks.filter(task => task.taskId !== taskId); 
    localStorage.setItem('tasks', JSON.stringify(savedTasks)); 
    renderTasks(); 
}


function editTask(taskId, updatedTask) {
    
   
    let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks = savedTasks.map(task => {
        if (task.taskId === taskId) {
            return { ...task, ...updatedTask }; 
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(savedTasks)); 
    renderTasks(); 
}


document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-button');
    const taskTableBody = document.getElementById('task-table-body');
    const deleteButton = document.getElementById('delete-button');
    const updateButton =document.getElementById('update-btn');
    populateDropdowns();
    
    // Make table rows selectable
    taskTableBody.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        if (row && row.querySelector('td')) {  
            document.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
            
            // Populate the modal form with the selected task's details
            const taskId = parseInt(row.getAttribute('data-task-id'));
            localStorage.setItem("taskId",taskId);
            const task = JSON.parse(localStorage.getItem('tasks')).find(task => task.taskId === taskId);
            if (task) {
                document.getElementById('taskId').value = task.taskId; // Set taskId in the hidden field
                document.getElementById('editTaskName').value = task.taskName;
                document.getElementById('editAssignedStudent').value = task.assignedStudent;
                document.getElementById('editStatus').value = task.status;
            }
        }
    });

    // Open the modal when the "Edit" button is clicked
    editButton.addEventListener('click', () => {
        const selectedRow = document.querySelector('tr.selected'); 
        if (selectedRow) {
            const taskId = parseInt(selectedRow.getAttribute('data-task-id')); 
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const task = tasks.find(task => task.taskId === taskId);
           
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const isStudent = JSON.parse(localStorage.getItem('isStudent')); 
     console.log(task.assignedStudent +"  "+ currentUser.username);
            if (task && (!isStudent || task.assignedStudent ==currentUser.username)) {
                openModal2(taskId);
            } else {
                alert("You don't have permission to edit this task.");
            }
        } else {
            alert('Please select a task to edit.');
        }
    });

    deleteButton.addEventListener('click', () => {
        const selectedRow = document.querySelector('tr.selected'); 
        const isStudent = localStorage.getItem('isStudent') === 'true';
        if(!isStudent){
        if (selectedRow) {
            const taskId = parseInt(selectedRow.getAttribute('data-task-id')); 
            const task = JSON.parse(localStorage.getItem('tasks')).find(task => task.taskId === taskId);
            
           deleteTask(taskId);
        } else {
            alert('Please select a task to delete.');
        }}
        else{
            alert("Only admin can delete tasks");
        }
    });

     updateButton.addEventListener('click', () => {
        const selectedRow = document.querySelector('tr.selected');
        if (selectedRow) {
            const taskId = parseInt(selectedRow.getAttribute('data-task-id'));
            const taskName = document.getElementById('editTaskName').value;
            const assignedStudent = document.getElementById('editAssignedStudent').value;
            const status = document.getElementById('editStatus').value;
            const project = document.getElementById('projectTitle2').value;
            const description = document.getElementById('description2').value;
            const dueDate = document.getElementById('dueDate2').value;

            const updatedTask = {
                taskId: taskId,
                project: project,
                taskName: taskName,
                description: description,
                assignedStudent: assignedStudent,
                status: status,
                dueDate: dueDate
            };

            editTask(taskId, updatedTask);
            closeModal2();
        } else {
            alert('Please select a task to update.');
        }
    });


    // Submit the form to update task
    document.getElementById('editTaskForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const taskId = 5;
        const taskName = document.getElementById('editTaskName').value;
        const assignedStudent = document.getElementById('editAssignedStudent').value;
        const status = document.getElementById('editStatus').value;
        const project = document.getElementById('projectTitle2').value;
        const description = document.getElementById('description2').value;
        const dueDate = document.getElementById('dueDate').value;


        // Validate input
        if (!taskName || !assignedStudent || !status||!dueDate||!project) {
            alert("All fields are required.");
            return;
        }

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTask = {
            taskId: parseInt(taskId),
            project, // Project is not being modified
            taskName,
            description, // Description is not being modified
            assignedStudent,
            status,
            dueDate // Due date is not being modified
        };

        // Find the task to update
        const updatedTasks = tasks.map(task => task.taskId === parseInt(taskId) ? updatedTask : task);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        // Render the updated tasks
        renderTasks();

        // Close the modal
        closeModal2();
    });
});
// Function to open modal
function openModal() {
    const modal = document.getElementById("taskModal");
    modal.style.display = "block";
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById("taskModal");
    modal.style.display = "none";
}

function openModal2(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.taskId === taskId);

    if (task) {
        document.getElementById('taskId').value = task.taskId;  // Store the original taskId
        document.getElementById('editTaskName').value = task.taskName;
        document.getElementById('editAssignedStudent').value = task.assignedStudent;
        document.getElementById('editStatus').value = task.status;
        document.getElementById('description2').value = task.description;
        const projectDropdown = document.getElementById("projectTitle2");
        const projects = JSON.parse(localStorage.getItem("projects"));
    
        // Clear existing options (except first placeholder)
        projectDropdown.innerHTML = `<option>Select a project</option>`;
        
    
        // Populate projects
        projects.forEach((project) => {
            const option = document.createElement("option");
            option.textContent = project.title;
            projectDropdown.appendChild(option);
        });
    }
    const modal = document.getElementById("editModal");
    modal.style.display = "block";
}

// Function to close modal
function closeModal2() {
    const modal = document.getElementById("editModal");
    modal.style.display = "none";
}

function populateDropdowns() {
    // Get stored projects and students
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const studentUsers = users.filter(user => user.isStudent === true);
    
    // Get dropdown elements
    const projectDropdown = document.getElementById("projectTitle");
    const studentDropdown = document.getElementById("assignedStudent");

    // Clear existing options (except first placeholder)
    projectDropdown.innerHTML = `<option value="">Select a project</option>`;
    studentDropdown.innerHTML = `<option value="">Select a Student</option>`;

    // Populate projects
    projects.forEach((project) => {
        const option = document.createElement("option");
        option.value = project.title;
        option.textContent = project.title;
        projectDropdown.appendChild(option);
    });

    const isStudent = localStorage.getItem('isStudent') === 'true';

    // Handle project selection change
    projectDropdown.addEventListener("change", function () {
        const selectedProject = projects.find(project => project.title === projectDropdown.value);
        studentDropdown.innerHTML = `<option value="">Select a Student</option>`; // Reset student options

        if (selectedProject) {
            const enrolledStudents = selectedProject.students.split(', ').map(s => s.trim());

            if (!isStudent) {
                // If not a student, show all students enrolled in the selected project
                studentUsers.forEach((student) => {
                    if (enrolledStudents.includes(student.username)) {
                        const option = document.createElement("option");
                        option.value = student.username;
                        option.textContent = student.username;
                        studentDropdown.appendChild(option);
                    }
                });
            } else {
                // If student, only allow the current user (if enrolled)
                let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (enrolledStudents.includes(currentUser.username)) {
                    const option = document.createElement("option");
                    option.value = currentUser.username;
                    option.textContent = currentUser.username;
                    studentDropdown.appendChild(option);
                }
            }
        }
    });
}


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


