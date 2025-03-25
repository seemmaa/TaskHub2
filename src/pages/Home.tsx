import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface AdminData {
  stats: {
    projects: number;
    students: number;
    tasks: number;
    finishedProjects: number;
  };
  chartData: {
    labels: string[];
    values: number[];
  };
}

const Home: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    initializeDashboard();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (adminData) {
      initializeChart();
    }
  }, [adminData]);

  const initializeDashboard = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || '{}';
    const studentStatus = localStorage.getItem('isStudent') === 'true';

    setIsStudent(studentStatus);
    setUsername(currentUser.username || '');

    const storedData = localStorage.getItem('adminData');
    if (storedData) {
      setAdminData(JSON.parse(storedData));
    } else {
      const defaultData: AdminData = {
        stats: {
          projects: 5,
          students: 20,
          tasks: 10,
          finishedProjects: 2,
        },
        chartData: {
          labels: ['Projects', 'Students', 'Tasks', 'Finished'],
          values: [5, 20, 10, 2],
        },
      };
      setAdminData(defaultData);
      localStorage.setItem('adminData', JSON.stringify(defaultData));
    }
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
    localStorage.removeItem('adminData');
    localStorage.removeItem('isStudent');
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
    window.location.href = '/signin';
  };

  if (!adminData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header username={username} isStudent={isStudent} onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar isStudent={isStudent} />
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-blue-500 text-2xl font-bold">Welcome to the Task Management System</h1>
            <div className="text-gray-300">{currentDateTime}</div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 mb-10 font-bold text-xl">
  <StatCard 
    title="Number of Projects" 
    value={adminData.stats.projects} 
  />

  {!isStudent && (
    <StatCard 
      title="Number of Students" 
      value={adminData.stats.students} 
    />
  )}

  <StatCard 
    title="Number of Tasks" 
    value={adminData.stats.tasks} 
  />

  <StatCard 
    title="Number of Finished Projects" 
    value={adminData.stats.finishedProjects} 
  />
</div>


          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-center mb-6 font-bold">Admin Dashboard Overview</h3>
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