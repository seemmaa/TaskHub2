import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaXmark, FaChevronDown, FaCheck, FaTrash } from 'react-icons/fa6';
import { FaEdit } from "react-icons/fa";
import { useQuery, useMutation, gql } from '@apollo/client';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';

// Type definitions
type Task = {
  taskId?: string;
  project: string;
  taskName: string;
  description: string;
  assignedStudent: string;
  status: string;
  dueDate: string;
};

type StatusOption = {
  value: string;
  label: string;
};
type SortOption = {
  value: string;
  label: string;
  sortFn: (a: Task, b: Task) => number;
};


type User = {
  username: string;
  isStudent: boolean;
};

// GraphQL queries and mutations
const GET_TASKS = gql`
  query GetTasks {
    getAllTasks {
      taskId
      project
      taskName
      description
      assignedStudent
      status
      dueDate
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($taskName: String!, $project: String!, $description: String!, $dueDate: String!, $status: String!, $assignedStudent: String!) {
    createTask(taskName: $taskName, project: $project, description: $description, dueDate: $dueDate, status: $status, assignedStudent: $assignedStudent) {
      taskId
      project
      taskName
      description
      assignedStudent
      status
      dueDate
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask( $task: UpdateTaskInput!) {
    updateTask( task:$task) {
      taskId
      project
      taskName
      description
      assignedStudent
      status
      dueDate
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($taskId: String!) {
    deleteTask(taskId: $taskId)
  }
`;

const GET_STUDENT_USERNAMES = gql`
  query {
    students
  }
`;

const GET_PROJECTS = gql`
  query {
    getProjects {
      id
      title
    }
  }
`;

const Task = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    project: '',
    taskName: '',
    description: '',
    assignedStudent: '',
    status: 'In Progress',
    dueDate: ''
  });
  const [students, setStudents] = useState<string[]>([]);
  const [projects, setProjects] = useState<{id: string, title: string}[]>([]);
  const [isStudent, setIsStudent] = useState<boolean>(false);

  
  
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  // Status dropdown options
  const statusOptions: StatusOption[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'on hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  const [sortOption, setSortOption] = useState<string>('dueDate-asc');

// Add these sort options after your statusOptions
const sortOptions: SortOption[] = [
  { 
    value: 'dueDate-asc', 
    label: 'Due Date ', 
    sortFn: (a, b) => {
      const now = new Date().getTime();
      const aTime = new Date(a.dueDate).getTime();
      const bTime = new Date(b.dueDate).getTime();
     
      const aDiff = Math.abs(aTime - now);
      const bDiff = Math.abs(bTime - now);
     
      return aDiff - bDiff;
    } 
  },
  { 
    value: 'none', 
    label: 'Sort By', 
    sortFn: (a, b) => 0 
  },
  
  { 
    value: 'status', 
    label: 'Status', 
    sortFn: (a, b) => a.status.localeCompare(b.status) 
  },
  { 
    value: 'project', 
    label: 'Project', 
    sortFn: (a, b) => a.project.localeCompare(b.project) 
  },
  { 
    value: 'student', 
    label: 'Assigned Student', 
    sortFn: (a, b) => a.assignedStudent.localeCompare(b.assignedStudent) 
  },
];

// Modify your useEffect for filtering tasks to include sorting
useEffect(() => {
  let filtered = tasks;
  
  if (searchQuery) {
    filtered = filtered.filter(t => 
      t.taskName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase())
 ) }
  
  if (selectedStatus !== 'all') {
    filtered = filtered.filter(t => t.status.toLowerCase() === selectedStatus.toLowerCase());
  }
  
  // Apply sorting
  const selectedSort = sortOptions.find(opt => opt.value === sortOption);
  if (selectedSort) {
    filtered = [...filtered].sort(selectedSort.sortFn);
  }
  
  setFilteredTasks(filtered);
}, [searchQuery, selectedStatus, tasks, isStudent, username, sortOption]);

  // GraphQL operations
  const { loading, error, data } = useQuery(GET_TASKS);
  const studentList = useQuery(GET_STUDENT_USERNAMES);
  const projectList = useQuery(GET_PROJECTS);

  const [addTask] = useMutation(ADD_TASK, {
    variables: { taskName: newTask.taskName, description: newTask.description,
        dueDate: newTask.dueDate, project: newTask.project, assignedStudent: newTask.assignedStudent, status: newTask.status
    },
    refetchQueries: [{ query: GET_TASKS }],
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    variables: { task: {taskId: selectedTask?.taskId,taskName: selectedTask?.taskName, description: selectedTask?.description,
        dueDate: selectedTask?.dueDate, project: selectedTask?.project, assignedStudent: selectedTask?.assignedStudent, status: selectedTask?.status
    } },
   
    refetchQueries: [{ query: GET_TASKS }],
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    variables: { taskId: selectedTask?.taskId },
    refetchQueries: [{ query: GET_TASKS }],
  });

  // Initialize data
  useEffect(() => {
    const studentStatus = localStorage.getItem('role') === 'student';
    setIsStudent(studentStatus);
  
    if (!studentList.loading && studentList.data?.students) {
      setStudents(studentList.data.students);
    }

    if (!projectList.loading && projectList.data?.getProjects) {
      setProjects(projectList.data.getProjects);
    }
  }, [studentList.loading, studentList.data, projectList.loading, projectList.data]);

  // Update tasks when data loads
  useEffect(() => {
    if (data && data.getAllTasks) {
      setTasks(data.getAllTasks);
      setFilteredTasks(data.getAllTasks);
    }
  }, [data]);

  // Filter tasks based on search and status
  useEffect(() => {
    let filtered = tasks;
    
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.taskName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.project.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status.toLowerCase() === selectedStatus.toLowerCase());
    }
    
    // If student, filter tasks assigned to them
   
    
    setFilteredTasks(filtered);
  }, [searchQuery, selectedStatus, tasks, isStudent, username]);

  // Add new task
  const handleAddTask = async () => {
    if (!newTask.project || !newTask.taskName || !newTask.assignedStudent || !newTask.dueDate) {
      alert("All fields are required!");
      return;
    }

    try {
      await addTask({
        variables: {
          input: newTask
        }
      });
      
      // Reset form
      setNewTask({
        project: '',
        taskName: '',
        description: '',
        assignedStudent: '',
        status: 'In Progress',
        dueDate: ''
      });
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task");
    }
  };

  // Update task
  const handleUpdateTask = async () => {
    if (!selectedTask?.taskId) return;
    
    try {
      await updateTask({
        variables: {
          id: selectedTask.taskId,
          input: selectedTask
        }
      });
      
      setIsEditModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task");
    }
  };

  // Delete task
  const handleDeleteTask = async () => {
    if (!selectedTask?.taskId) return;
    
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await deleteTask({
        variables: {
          id: selectedTask.taskId
        }
      });
      
      setSelectedTask(null);
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (selectedTask && isEditModalOpen) {
      setSelectedTask(prev => ({ ...prev!, [name]: value }));
    } else {
      setNewTask(prev => ({ ...prev, [name]: value }));
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isStudent');
    localStorage.removeItem('isSignedIn');
    navigate('/signin');
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-amber-500';
      case 'in progress': return 'text-green-500';
      case 'completed': return 'text-blue-500';
      case 'on hold': return 'text-yellow-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header username={username} role={role} onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar isStudent={isStudent} />
        
        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-900">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Tasks Management</h2>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
          
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create New Task
              </button>
              <div className="relative">
    <button 
      className="flex items-center justify-between w-48 bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
      onClick={() => document.getElementById('sortDropdown')?.classList.toggle('hidden')}
    >
      <span>
        {sortOptions.find(opt => opt.value === sortOption)?.label || 'Sort By'}
      </span>
      <FaChevronDown className="ml-2" />
    </button>
    
    <div 
      id="sortDropdown"
      className="hidden absolute z-10 mt-1 w-56 bg-gray-800 border border-gray-700 rounded shadow-lg"
    >
      <ul>
        {sortOptions.map((option) => (
          <li 
            key={option.value}
            className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center ${
              sortOption === option.value ? 'bg-gray-700' : ''
            }`}
            onClick={() => {
              setSortOption(option.value);
              document.getElementById('sortDropdown')?.classList.add('hidden');
            }}
          >
            <span>{option.label}</span>
            {sortOption === option.value && <FaCheck />}
          </li>
        ))}
      </ul>
    </div>
  </div>
            
            <input
              type="text"
              placeholder="Search tasks by name, description or project..."
              className="flex-1 min-w-[200px] p-2 rounded border bg-white border-gray-900 text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => selectedTask ? setIsEditModalOpen(true) : alert("Please select a task first")}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-600"
                disabled={!selectedTask ||isStudent&&selectedTask.assignedStudent !== username}
              >
                <FaEdit />
              </button>
              <button
                onClick={handleDeleteTask}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:bg-gray-600"
                disabled={!selectedTask ||isStudent&&selectedTask.assignedStudent !== username }
              >
                <FaTrash />
              </button>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="overflow-x-auto w-full bg-gray-800 rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Task ID</th>
                  <th className="p-3 text-left">Project</th>
                  <th className="p-3 text-left">Task Name</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Assigned Student</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr 
                    key={task.taskId}
                    onClick={() => setSelectedTask(task)}
                    className={`border-t border-gray-700 hover:bg-gray-700 cursor-pointer ${
                      selectedTask?.taskId === task.taskId ? 'bg-gray-700' : ''
                    }`}
                  >
                    <td className="p-3">{task.taskId}</td>
                    <td className="p-3">{task.project}</td>
                    <td className="p-3">{task.taskName}</td>
                    <td className="p-3">{task.description}</td>
                    <td className="p-3">{task.assignedStudent}</td>
                    <td className={`p-3 ${getStatusColor(task.status)}`}>
                      {task.status}
                    </td>
                    <td className="p-3">{new Date(Number(task.dueDate)).toLocaleString(
                       [], {
                            day: '2-digit',
                             month: '2-digit',
                            year: 'numeric',
                           
                           
                           
                        })}
                       
                    
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Create Task Modal */}
      {/* Create Task Modal */}
{isCreateModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-900 text-white rounded-lg w-full max-w-md max-h-[100vh] overflow-hidden">
      {/* Modal Header */}
      <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-400">Create New Task</h2>
        <button 
          onClick={() => setIsCreateModalOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          <FaXmark size={24} />
        </button>
      </div>
      
      {/* Modal Body */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleAddTask}
        task={newTask}
        onInputChange={handleInputChange}
        projects={projects}
        students={newTask.assignedStudent.split(',')}
        mode="create"
      />
    </div>
  </div>
)}

{/* Edit Task Modal - Separate from Create Modal */}
{isEditModalOpen && selectedTask && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-900 text-white rounded-lg w-full max-w-md max-h-[100vh] overflow-hidden">
      {/* Modal Header */}
      <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-400">Edit Task</h2>
        <button 
          onClick={() => setIsEditModalOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          <FaXmark size={24} />
        </button>
      </div>
      
      {/* Modal Body */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateTask}
        task={selectedTask}
        onInputChange={handleInputChange}
        projects={projects}
        students={students}
        mode="edit"
      />
    </div>
  </div>
)}
    </div>
  );
};

export default Task;