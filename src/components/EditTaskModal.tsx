import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';

const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask(
    $taskId: ID!
    $taskName: String
    $description: String
    $status: String
    $dueDate: String
  ) {
    updateTask(
      taskId: $taskId
      taskName: $taskName
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      taskId
      taskName
      description
      status
      dueDate
    }
  }
`;

interface Task {
  taskId: string;
  taskName: string;
  description: string;
  status: string;
  dueDate: string;
  project: string;
  assignedStudent: string;
}

interface UpdateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
 // refetchTasks: () => void;
}

const EditTaskModal: React.FC<UpdateTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  task, 
  //refetchTasks 
}) => {
  const [taskInput, setTaskInput] = useState<Omit<Task, 'taskId' | 'project' | 'assignedStudent'>>({
    taskName: '',
    description: '',
    status: 'Pending',
    dueDate: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const [updateTask, { loading }] = useMutation(UPDATE_TASK_MUTATION, {
    onCompleted: () => {
    //  refetchTasks();
      onClose();
    },
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });

  useEffect(() => {
    if (task) {
      setTaskInput({
        taskName: task.taskName,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate
      });
    }
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!task) return;

    updateTask({
      variables: {
        taskId: task.taskId,
        ...taskInput
      }
    });
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Update Task</h2>
        
        {errorMessage && (
          <div className="text-red-400 mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Project</label>
            <div className="p-2 bg-gray-700 text-white rounded">
              {task.project}
            </div>
          </div>

          <div>
            <label htmlFor="taskName" className="block text-white mb-2">Task Name</label>
            <input
              type="text"
              id="taskName"
              name="taskName"
              value={taskInput.taskName}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-white mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={taskInput.description}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-white mb-2">Assigned Student</label>
            <div className="p-2 bg-gray-700 text-white rounded">
              {task.assignedStudent}
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-white mb-2">Status</label>
            <select
              id="status"
              name="status"
              value={taskInput.status}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-white mb-2">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={taskInput.dueDate}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;