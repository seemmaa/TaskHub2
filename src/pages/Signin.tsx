import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!,$staySignedIn: Boolean!) {
    login(username: $username, password: $password, staySignedIn: $staySignedIn) {
    id
    username
    role
    token
   
    }
  }
`;

interface LoginData {
  login: {
   id: string;
    token: string;
    username: string;
    role: string;}
  
}

interface LoginVariables {
  username: string;
  password: string;
  staySignedIn: boolean;
}

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  const [login, { loading }] = useMutation<LoginData, LoginVariables>(LOGIN_MUTATION, {
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });

  // Initialize fake data on component mount
  useEffect(() => {
    initializeFakeData();
    loadProjects();
    
    // Check if user is already signed in
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true';
    if (isSignedIn) {
      navigate('/home');
    }
  }, [navigate]);

  const sampleProjects = [
    { title: "Website Redesign", description: "Redesign the company website.", students: "Ibn Malik, Student 2", category: "Web Development", status: "Completed", progress: 100, startingDate: "2023-01-01", endingDate: "2025-06-01" },
    { title: "Mobile App Development", description: "Develop a mobile app.", students: "Student 3, Student 4", category: "Mobile Development", status: "In Progress", progress: 50, startingDate: "2023-02-15", endingDate: "2023-08-15" },
    { title: "Data Analysis Project", description: "Analyze company data.", students: "Student 5", category: "Data Science", status: "Pending", progress: 20, startingDate: "2023-03-01", endingDate: "2023-05-01" }
  ];

  const loadProjects = () => {
    let projects = JSON.parse(localStorage.getItem("projects")) || sampleProjects;
    localStorage.setItem("projects", JSON.stringify(projects));
  };

  const initializeFakeData = () => {
    if (!localStorage.getItem("users") || !localStorage.getItem("projects") || !localStorage.getItem("tasks")) {
      const fakeUsers = [
        { username: "admin1", password: "admin123", isStudent: false, universityId: null },
        { username: "student1", password: "student123", isStudent: true, universityId: "1001" },
        { username: "student2", password: "student123", isStudent: true, universityId: "1002" },
        { username: "student3", password: "student123", isStudent: true, universityId: "1003" },
        { title: "Website Redesign", description: "Redesign the company website.", students: "Ibn Malik, Student 2", category: "Web Development", status: "Completed", progress: 100, startingDate: "2023-01-01", endingDate: "2025-06-01" },
        { title: "Mobile App Development", description: "Develop a mobile app.", students: "Student 3, Student 4", category: "Mobile Development", status: "In Progress", progress: 50, startingDate: "2023-02-15", endingDate: "2023-08-15" },
        { title: "Data Analysis Project", description: "Analyze company data.", students: "Student 5", category: "Data Science", status: "Pending", progress: 20, startingDate: "2023-03-01", endingDate: "2023-05-01" }
      ];

      const fakeProjects = [
        {
          title: "E-commerce Platform",
          description: "Develop an online shopping platform.",
          students: "student1, student2",
          category: "Web Development",
          status: "In Progress",
          progress: 60,
          startingDate: "2023-09-01",
          endingDate: "2023-12-31"
        },
        {
          title: "AI Chatbot",
          description: "Build an AI-powered chatbot for customer support.",
          students: "student2, student3",
          category: "Artificial Intelligence",
          status: "Pending",
          progress: 20,
          startingDate: "2023-10-01",
          endingDate: "2024-02-28"
        },
        {
          title: "Data Visualization Dashboard",
          description: "Create a dashboard to visualize company data.",
          students: "student1, student3",
          category: "Data Science",
          status: "Completed",
          progress: 100,
          startingDate: "2023-07-01",
          endingDate: "2023-09-30"
        }
      ];

      const fakeTasks = [
        {
          taskId: 1,
          project: "E-commerce Platform",
          taskName: "Design User Interface",
          description: "Create wireframes and UI designs for the platform.",
          assignedStudent: "student1",
          status: "In Progress",
          dueDate: "2023-10-15"
        },
        {
          taskId: 2,
          project: "E-commerce Platform",
          taskName: "Implement Payment Gateway",
          description: "Integrate a payment gateway for transactions.",
          assignedStudent: "student2",
          status: "Pending",
          dueDate: "2023-11-01"
        },
        {
          taskId: 3,
          project: "AI Chatbot",
          taskName: "Train NLP Model",
          description: "Train a natural language processing model for the chatbot.",
          assignedStudent: "student2",
          status: "Pending",
          dueDate: "2023-10-20"
        },
        {
          taskId: 4,
          project: "Data Visualization Dashboard",
          taskName: "Deploy Dashboard",
          description: "Deploy the dashboard to the production server.",
          assignedStudent: "student3",
          status: "Completed",
          dueDate: "2023-09-25"
        }
      ];

      localStorage.setItem("users", JSON.stringify(fakeUsers));
      localStorage.setItem("projects", JSON.stringify(fakeProjects));
      localStorage.setItem("tasks", JSON.stringify(fakeTasks));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    
    try {
      const { data } = await login({
        variables: {
          username,
          password,
          staySignedIn
        }
      });

      if (data?.login) {
        // Save token and user info to localStorage
        if (staySignedIn) {
          localStorage.setItem('authToken', data.login.token);  // persists across sessions
        } else {
          sessionStorage.setItem('authToken', data.login.token); // expires on tab/browser close
        }
        localStorage.setItem('username', data.login.username);
        localStorage.setItem('role', data.login.role);
        localStorage.setItem("isStudent", JSON.stringify(data.login.role === 'student'));
        localStorage.setItem("currentUser", data.login.username);
        localStorage.setItem("userId", data.login.id);
        localStorage.setItem("token", data.login.token);

        if (staySignedIn) {
          localStorage.setItem('isSignedIn', 'true');
        }

        navigate('/home');
      }
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-lg py-5">
        <h1 className="text-white text-4xl font-bold mb-8">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-white text-lg">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-gray-700 text-white rounded-lg border-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-white text-lg">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-700 text-white rounded-lg border-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="staySignedIn"
              checked={staySignedIn}
              onChange={(e) => setStaySignedIn(e.target.checked)}
              className="w-5 h-5 bg-gray-700 rounded focus:ring-green-500"
              disabled={loading}
            />
            <label htmlFor="staySignedIn" className="text-white">Stay Signed In</label>
          </div>
          
          {errorMessage && (
            <div className="text-red-400 text-center text-sm min-h-5">
              {errorMessage}
            </div>
          )}
          
          <button
            type="submit"
            className={`w-full p-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors mt-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="text-gray-400 text-center mt-5">
            <p>Don't have an account? <Link to="/signup" className="text-green-500 hover:underline">Sign Up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;