import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { useQuery, gql } from '@apollo/client';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface AdminData {
  stats: {
    projects: number;
    students: number;
   // tasks: number;
    finishedProjects: number;
  };
  chartData: {
    labels: string[];
    values: number[];
  };
}

// GraphQL queries
const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    getDashboardStats {
      projects
      students
    
      finishedProjects
      tasks
    }
    getProjects {
      status
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      role
    }
  }
`;

const Home: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const role = localStorage.getItem('role');

  // GraphQL queries
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);
  const { data: usersData } = useQuery(GET_USERS);

  useEffect(() => {
    initializeDashboard();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (data) {
      processDashboardData();
    }
  }, [data]);

  useEffect(() => {
    if (adminData) {
      initializeChart();
    }
  }, [adminData]);

  const initializeDashboard = () => {
    const storedUsername = localStorage.getItem('username') || '';
    const studentStatus = localStorage.getItem('role') === 'student';

    setIsStudent(studentStatus);
    setUsername(storedUsername);
  };

  const processDashboardData = () => {
    if (!data) return;

    // Calculate finished projects count
    const finishedProjects = data.getProjects.filter(
      (project: { status: string }) => project.status === 'Completed'
    ).length;

    // Calculate student count from users data
    const studentCount = usersData?.getUsers?.filter(
      (user: { role: string }) => user.role === 'student'
    ).length || 0;

    const dashboardStats = {
      stats: {
        projects: data.getDashboardStats.projects,
        students: data.getDashboardStats.students,
       tasks: data.getDashboardStats.tasks,
        finishedProjects:data.getDashboardStats.finishedProjects ,
      },
      chartData: {
        labels: ['Projects', 'Students', 'Tasks', 'Finished'],
        values: [
          data.getDashboardStats.projects,
          studentCount,
         
          data.getDashboardStats.tasks,
          finishedProjects,
        ],
      },
    };

    setAdminData(dashboardStats);
  };

  const updateDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    const formattedDateTime = now.toLocaleDateString('en-US', options)
      .replace(/(\d+):(\d+):(\d+)/, '$1:$2:$3');
    setCurrentDateTime(formattedDateTime);
  };

  const initializeChart = () => {
    if (!adminData) return;

    const ctx = document.getElementById('dashboard-chart') as HTMLCanvasElement;
    if (!ctx) return;

    const filteredLabels = adminData.chartData.labels.filter(
      (label) => !(isStudent && label === 'Students')
    );
    const filteredValues = adminData.chartData.values.filter(
      (_, index) => !(isStudent && adminData.chartData.labels[index] === 'Students')
    );

    const colors = ['#2c7873', '#1e5f74', '#c6a700', '#6b2d5c'];
    const borderColors = ['#2c7873', '#1e5f74', '#c6a700', '#6b2d5c'];

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: filteredLabels,
        datasets: [
          {
            label: 'Count',
            data: filteredValues,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#333' },
            ticks: { color: '#aaa' },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#aaa' },
          },
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#aaa',
              boxWidth: 15,
              padding: 10,
            },
          },
        },
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isStudent');
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
    window.location.href = '/signin';
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">Error: {error.message}</div>;
  if (!adminData) return <div className="min-h-screen bg-gray-900 flex items-center justify-center lg:w-1/2">Loading dashboard data...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <Header username={username} role={role} onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar isStudent={isStudent} />
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-blue-500 text-2xl font-bold">Welcome to the Task Management System</h1>
            <div className="text-gray-300">{currentDateTime}</div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 mb-10 font-bold text-xl px-5">
            <StatCard 
              title="Number of Projects" 
              value={data.getDashboardStats.projects} 
            />

            {!isStudent && (
              <StatCard 
                title="Number of Students" 
                value={adminData.stats.students} 
              />
            )}

            <StatCard 
              title="Number of Tasks" 
              value={data.getDashboardStats.tasks} 
            />

            <StatCard 
              title="Number of Finished Projects" 
              value={data.getDashboardStats.finishedProjects} 
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-center mb-6 font-bold">Dashboard Overview</h3>
            <div className="h-96">
              <canvas id="dashboard-chart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number }> = ({ title, value }) => (
  <div className="bg-gray-700 rounded-lg p-6 text-center flex flex-col items-center justify-center">
    <h3 className="text-white mb-3">{title}</h3>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export default Home;