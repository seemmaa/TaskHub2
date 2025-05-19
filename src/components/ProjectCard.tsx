// components/ProjectCard.tsx
import React from 'react';
import { FaTasks } from 'react-icons/fa';
import { useQuery, gql } from '@apollo/client';

type Project = {
  id?: string;
  title: string;
  description: string;
  students: string;
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

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [showTasks, setShowTasks] = React.useState(false);
  const { loading, error, data } = useQuery(GET_PROJECT_TASKS, {
    variables: { projectName: project.title },
    skip: !showTasks,
  });

  const getStatusBorderColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending': return 'border-amber-700';
      case 'in progress': return 'border-green-700';
      case 'completed': return 'border-blue-700';
      default: return 'border-gray-500';
    }
  };

  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow ${getStatusBorderColor(project.status)} border-2 min-w-0.5`}>
      <div 
        className="cursor-pointer"
        onClick={() => setShowTasks(!showTasks)}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">{project.title}</h3>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setShowTasks(!showTasks);
            }}
          >
            <FaTasks />
          </button>
        </div>
        <p className="mb-2"><strong>Description:</strong> {project.description}</p>
        <p className="mb-2"><strong>Students:</strong> {project.students}</p>
        <p className="mb-2"><strong>Category:</strong> {project.category}</p>
        
        {/* Progress Bar */}
        <div className="h-5 bg-gray-700 rounded-full mt-5 mb-5">
          <div 
            className="h-full bg-blue-600 rounded-full flex items-center justify-center text-xs px-3 py-1 text-white font-bold"
            style={{ width: `${project.progress}%` }}
          >
            {project.progress}%
          </div>
        </div>
        
        {/* Dates */}
        <div className="flex justify-between text-sm mt-4">
          <span>{project.startingDate}</span>
          <span>{project.endingDate}</span>
        </div>
      </div>

      {/* Tasks Section */}
     
    </div>
  );
};

export default ProjectCard;