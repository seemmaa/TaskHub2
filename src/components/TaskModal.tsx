import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { FaXmark } from 'react-icons/fa6';

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  task: {
    project: string;
    taskName: string;
    description: string;
    assignedStudent: string;
    status: string;
    dueDate: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  projects: { id: string; title: string }[];
  students: string[];
  mode: 'create' | 'edit';
};
const GET_PROJECT_STUDENTS = gql`
  query GetProjectStudents($projectName: String!) {
    getProjectStudents(projectName: $projectName)
  }
`;
const GET_PROJECT_BY_STUDENT = gql`
  query GetprojectByStudent($studentName: String!) {
    getprojectByStudent(studentName: $studentName) {
         id
    title
    description
    category
    startingDate
    endingDate
    status
    progress
    students
    }
  }
`;
interface Props {
  projectName: string;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  onInputChange,
  projects,
  students,
  mode
}) => {
  const projectName = task.project;
  const { loading, error, data } = useQuery(GET_PROJECT_STUDENTS, {
    variables: { projectName: task.project },
    skip: !task.project, // Only run query if a project is selected
  });
  const { loading: loadingProject, error: errorProject, data: dataProject } = useQuery(GET_PROJECT_BY_STUDENT, {
    variables: { studentName: localStorage.getItem('currentUser') },
    skip: !localStorage.getItem('currentUser'), // Only run query if a project is selected
  });
  const isStudent=localStorage.getItem('isStudent') === 'true';
  const currentUser=localStorage.getItem('currentUser');
  const hasCradintials= task.assignedStudent==currentUser;
  if (!isOpen) return null;

 
  
  console.log('TaskModalProps',data);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg w-full max-w-md max-h-[100vh] overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-400">
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaXmark size={24} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="mb-4">
            <label className="block font-bold mb-2">Project:</label>
            <select
              name="project"
              value={task.project}
              onChange={onInputChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            >
              <option value="">Select a project</option>
              {isStudent?(dataProject?.getprojectByStudent?.map(project => (
                <option key={project.id} value={project.title}>{project.title}</option>)
              )):(projects.map(project => (
                <option key={project.id} value={project.title}>{project.title}</option>)
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2">Task Name:</label>
            <input
              type="text"
              name="taskName"
              value={task.taskName}
              onChange={onInputChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2">Description:</label>
            <textarea
              rows={3}
              name="description"
              value={task.description}
              onChange={onInputChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2">Assigned Student:</label>
            <select
              name="assignedStudent"
              value={task.assignedStudent}
              onChange={onInputChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            >
              <option value="">Select a student</option>
              {(isStudent
            ? [currentUser] // only self
            : data?.getProjectStudents || [] // all project students
          ).map((student: string) => (
            <option key={student} value={student}>{student}</option>
          ))
          }
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2">Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={onInputChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-bold mb-2">Status:</label>
            <select
              name="status"
              value={task.status}
              onChange={onInputChange}
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
        <div className="sticky top-0 bg-gray-900 p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onSubmit}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            {mode === 'create' ? 'Create Task' : 'Update Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;