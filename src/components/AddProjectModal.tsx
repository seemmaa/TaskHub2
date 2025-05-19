// components/AddProjectModal.tsx
import React, { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';

type ProjectInput = {
  title: string;
  description: string;
  students: string[];
  category: string;
  status: string;
  startingDate: string;
  endingDate: string;
};

type AddProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: ProjectInput) => void;
  students: string[];
};

const AddProjectModal: React.FC<AddProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  students 
}) => {
  const [newProject, setNewProject] = useState<Omit<ProjectInput, 'students'>>({
    title: '',
    description: '',
    category: 'Web Development',
    status: 'In Progress',
    startingDate: '',
    endingDate: ''
  });
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const toggleStudentSelection = (student: string) => {
    setSelectedStudents(prev => 
      prev.includes(student) 
        ? prev.filter(s => s !== student)
        : [...prev, student]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      ...newProject,
      students: selectedStudents
    });
    // Reset form
    setNewProject({
      title: '',
      description: '',
      category: 'Web Development',
      status: 'In Progress',
      startingDate: '',
      endingDate: ''
    });
    setSelectedStudents([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg w-full max-w-md max-h-[100vh] overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-400">Add New Project</h2>
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
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
          <button
            onClick={handleSubmit}
            className="w-100 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;