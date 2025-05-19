// pages/ProjectsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { useQuery, useMutation, gql } from '@apollo/client';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

// Type definitions
type Project = {
  id?: string;
  title: string;
  description: string;
  students: string[];
  category: string;
  status: string;
  progress: number;
  startingDate: string;
  endingDate: string;
};

type Task = {
  taskId: string;
  taskName: string;
  description: string;
  assignedStudent: string;
  status: string;
};

type StatusOption = {
  value: string;
  label: string;
};

// GraphQL queries and mutations
const GET_PROJECTS = gql`
  query GetProjects {
    getProjects {
      id
      title
      description
      students
      category
      status
      progress
      startingDate
      endingDate
    }
  }
`;

const ADD_PROJECT = gql`
  mutation AddProject($input: ProjectInput!) {
    addProject(input: $input) {
      id
      title
      description
      students
      category
      status
      progress
      startingDate
      endingDate
    }
  }
`;

const GET_PROJECT_TASKS = gql`
  query GetProjectTasks($projectName: String!) {
    getProjectTasks(projectName: $projectName) {
      taskId
      taskName
      description
      assignedStudent
      status
    }
  }
`;

const GET_STUDENT_USERNAMES = gql`
  query {
    students
  }
`;

const Project = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'students' | 'progress'> & { students: string[] }>({
    title: '',
    description: '',
    students: [],
    category: 'Web Development',
    status: 'In Progress',
    startingDate: '',
    endingDate: ''
  });
  const [students, setStudents] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  // Status dropdown options
  const statusOptions: StatusOption[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'on hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // GraphQL operations
  const { loading, error, data } = useQuery(GET_PROJECTS);
  const studentList = useQuery(GET_STUDENT_USERNAMES);
  const [addProject] = useMutation(ADD_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  const { data: tasksData, loading: tasksLoading, error: tasksError } = useQuery(GET_PROJECT_TASKS, {
    variables: { projectName: selectedProject?.title || '' },
    skip: !selectedProject,
  });

  // Initialize data
  useEffect(() => {
    const studentStatus = localStorage.getItem('role') === 'student';
    setIsStudent(studentStatus);
  
    if (!studentList.loading && studentList.data?.students) {
      setStudents(studentList.data.students);
    }
  }, [studentList.loading, studentList.data]);

  // Update projects when data loads
  useEffect(() => {
    if (data && data.getProjects) {
      const formattedProjects = data.getProjects.map((project: any) => ({
        ...project,
        students: project.students.join(", ")
      }));
      setProjects(formattedProjects);
      setFilteredProjects(formattedProjects);
    }
  }, [data]);

  // Update tasks when selected project changes
  useEffect(() => {
    if (tasksData && tasksData.getProjectTasks) {
      setTasks(tasksData.getProjectTasks);
      setIsSidebarOpen(true);
    }
  }, [tasksData]);

  // Filter projects based on search and status
  useEffect(() => {
    let filtered = projects;
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status.toLowerCase() === selectedStatus.toLowerCase());
    }
    
    setFilteredProjects(filtered);
  }, [searchQuery, selectedStatus, projects]);

  // Handle project selection
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    
  };

  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedProject(null);
  };

  // Calculate progress based on dates
  const calculateProgress = (startDate: string, endDate: string): number => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    const totalDuration = end.getTime() - start.getTime();
    const elapsedTime = today.getTime() - start.getTime();
    let progress = (elapsedTime / totalDuration) * 100;
    progress = Math.max(0, Math.min(100, progress));
    return Math.round(progress);
  };

  // Add new project
  const addNewProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim() || selectedStudents.length === 0) {
      alert("Title, description, and at least one student are required!");
      return;
    }

    const progress = calculateProgress(newProject.startingDate, newProject.endingDate);
    
    try {
      await addProject({
        variables: {
          input: {
            ...newProject,
            students: selectedStudents,
            progress,
          }
        }
      });
      
      // Reset form
      setNewProject({
        title: '',
        description: '',
        students: [],
        category: 'Web Development',
        status: 'In Progress',
        startingDate: '',
        endingDate: ''
      });
      setSelectedStudents([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding project:", err);
      alert("Failed to add project");
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  // Handle student selection
  const toggleStudentSelection = (student: string) => {
    setSelectedStudents(prev => 
      prev.includes(student) 
        ? prev.filter(s => s !== student)
        : [...prev, student]
    );
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
      case 'in progress': return 'text-green-500';
      case 'completed': return 'text-blue-500';
      case 'pending': return 'text-amber-500';
      default: return 'text-gray-500';
    }
  };
  const getStatusBorderColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending': return 'border-amber-700';
      case 'in progress': return 'border-green-700';
      case 'completed': return 'border-blue-700';
      default: return 'border-gray-500';
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
        <main className="flex-1 p-6 bg-gray-900 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Projects Overview</h2>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            {!isStudent && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add New Project
              </button>
            )}
            
            <input
              type="text"
              placeholder="Search projects by title or description..."
              className="flex-1 min-w-[200px] p-2 rounded border bg-white border-gray-900 text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex items-center justify-between w-40 bg-white text-black border border-gray-700 rounded px-3 py-2"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-50}">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id || index}
                className={`bg-gray-800 rounded-lg shadow  border ${getStatusBorderColor(project.status)} overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors m-3`}
                onClick={() => handleProjectClick(project)}
              >
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-blue-500 mb-1">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                  <div>
                  <span className="font-bold">Description: </span>
                  <span>{project.description}</span></div>
                  
                    <div>
                      <span className="font-bold">Students: </span>
                      <span>{project.students}</span>
                    </div>
                    <div>
                      <span className="font-bold">Category: </span>
                      <span>{project.category}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="w-full bg-gray-700 rounded-full h-4 relative ">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-300 p-2"
                        style={{ width: `${project.progress}%` }}
                      >
                        <span className="absolute left-1/2 transform -translate-x-1/2">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-2 text-sm "> 
                  <span>{project.startingDate}</span>
                    <span>{project.endingDate}</span></div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Tasks Sidebar */}
        {isSidebarOpen && selectedProject && (
          <div className="fixed inset-0 bg-opacity-50 z-40" onClick={closeSidebar}></div>
        )}
        <div className={`fixed top-0 right-0 h-full mt-16.5 w-1/3 md:w-1/3 lg:w-1/4 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedProject && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-blue-400 ">{selectedProject.title}</h3>
                <button onClick={closeSidebar} className="text-gray-400 hover:text-white">
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto gap-1  flex-1">
                <div className="">
                 <div className="">
                  <div className="flex items-center gap-1  mb-1">
                  <span className=" font-bold ">Description: </span>
                  <span className="">{selectedProject.description}</span></div>
                  <div className="flex items-center gap-1  mb-1">
                      <span className="font-bold">Category: </span>
                      <span>{selectedProject.category}</span>
                    </div>
                    <div className="flex items-center gap-1  mb-1">
                      <span className="font-bold">Students: </span>
                      <span>{selectedProject.students}</span>
                    </div>
                    
                    <div className="flex items-center gap-1  mb-1">
                      <span className="font-bold">Start Date: </span>
                      <span>{selectedProject.startingDate}</span>
                    </div>
                    <div className="flex items-center gap-1  mb-1">
                      <span className="font-bold">End Date: </span>
                      <span>{selectedProject.endingDate}</span>
                    </div>
                  </div>
                 
                  
                  
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-4 text-blue-400">Tasks</h4>
                  
                  {tasksLoading ? (
                    <p className="text-gray-400">Loading tasks...</p>
                  ) : tasksError ? (
                    <p className="text-red-500">Error loading tasks: {tasksError.message}</p>
                  ) : tasks.length > 0 ? (
                    <div className="space-y-4 border-green-400">
                      {tasks.map((task) => (
                        <div key={task.taskId} className="bg-gray-700 p-4 rounded-lg border-1 border-green-400">
                         
                          <div className="flex items-center gap-1 ">
                           
                          <p className=" text-sm mb-2 font-bold">Task ID: </p>
                          <p className="text-sm mb-2">{task.taskId}</p></div>
                          <div className="flex items-center gap-1 ">
                           
                          <p className=" text-sm mb-2 font-bold">Task Name: </p>
                          <p className="text-sm mb-2">{task.taskName}</p></div>
                          <div className="flex items-center gap-1 ">
                           
                          <p className=" text-sm mb-2 font-bold">Description: </p>
                          <p className="text-sm mb-2">{task.description}</p></div>
                          <div className="flex items-center gap-1 ">
                           
                          <p className=" text-sm mb-2 font-bold">Assigned Student: </p>
                          <p className="text-sm mb-2">{task.assignedStudent}</p></div>
                          <div className="flex items-center gap-1 ">
                           
                          <p className=" text-sm mb-2 font-bold">Status: </p>
                          <p className="text-sm mb-2">{task.status}</p></div>
                         
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No tasks found for this project.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white rounded-lg w-full max-w-md max-h-[100vh] overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-400">Add New Project</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <label className="block font-bold mb-2">Project Title:</label>
                <input
                  type="text"
                  name="title"
                  value={newProject.title}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block font-bold mb-2">Project Description:</label>
                <textarea
                  rows={3}
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block font-bold mb-2">Students List:</label>
                <div className="h-20 overflow-y-auto bg-gray-800 p-2 rounded border border-gray-700">
                  {students.map((student, index) => (
                    <p 
                      key={index}
                      className={`p-1 cursor-pointer rounded m-1 text-sm ${
                        selectedStudents.includes(student) ? 'bg-gray-600' : 'hover:bg-gray-700'
                      }`}
                      onClick={() => toggleStudentSelection(student)}
                    >
                      {student}
                    </p>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block font-bold mb-2">Project Category:</label>
                <select
                  name="category"
                  value={newProject.category}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Mobile Development">Mobile Development</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block font-bold mb-2">Starting Date:</label>
                <input
                  type="date"
                  name="startingDate"
                  value={newProject.startingDate}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block font-bold mb-2">Ending Date:</label>
                <input
                  type="date"
                  name="endingDate"
                  value={newProject.endingDate}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block font-bold mb-2">Project Status:</label>
                <select
                  name="status"
                  value={newProject.status}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="sticky top-0 bg-gray-900 p-4 border-t border-gray-700 flex justify-center">
              <button
                onClick={addNewProject}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;