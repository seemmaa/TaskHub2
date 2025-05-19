// components/ProjectTasksModal.tsx
import React from 'react';
import { FaXmark } from 'react-icons/fa6';

type Task = {
  taskId: string;
  project: string;
  taskName: string;
  description: string;
  dueDate: string;
  assignedStudent: string;
  status: string;
};

type ProjectTasksModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  tasks: Task[];
};

const ProjectTasksModal: React.FC<ProjectTasksModalProps> = ({ 
  isOpen, 
  onClose, 
  projectTitle, 
  tasks 
}) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-400">Tasks for Project: {projectTitle}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaXmark size={24} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {tasks.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Task Name</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Assigned To</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.taskId} className="border-t border-gray-700 hover:bg-gray-800">
                    <td className="p-3">{task.taskName}</td>
                    <td className="p-3">{task.description}</td>
                    <td className="p-3">{task.assignedStudent}</td>
                    <td className={`p-3 ${getStatusColor(task.status)}`}>
                      {task.status}
                    </td>
                    <td className="p-3">
                      {new Date(Number(task.dueDate)).toLocaleString([], {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No tasks found for this project.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTasksModal;