import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!, $universityId: String) {
    register(username: $username, password: $password, universityId: $universityId) {
      id
      username
      role
    }
  }
`;

type User = {
  username: string;
  password: string;
  isStudent: boolean;
  universityId?: string;
};

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    username: '',
    password: '',
    isStudent: false,
    universityId: ''
  });
  const [showUniversityId, setShowUniversityId] = useState(false);
  const [error, setError] = useState('');
  
  // Correct placement of useMutation inside the component
  const [registerUser] = useMutation(REGISTER_MUTATION);

  // Check localStorage for saved isStudent status
  useEffect(() => {
    const savedIsStudent = localStorage.getItem('isStudent') === 'true';
    if (savedIsStudent) {
      setUser(prev => ({ ...prev, isStudent: true }));
      setShowUniversityId(true);
    }
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Toggle university ID field
    if (name === 'isStudent') {
      setShowUniversityId(checked);
      if (!checked) {
        setUser(prev => ({ ...prev, universityId: '' }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (!user.username || !user.password) {
      setError('Username and password are required');
      return;
    }
  
    if (user.isStudent && !user.universityId) {
      setError('University ID is required for students');
      return;
    }
  
    try {
      const { data } = await registerUser({
        variables: {
          username: user.username,
          password: user.password,
          universityId: user.isStudent ? user.universityId : undefined,
        },
      });
  
      console.log('Registered:', data?.register);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-lg">
        <h1 className="text-white text-3xl font-bold mb-8 text-left">Sign Up</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-white text-lg font-bold">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full p-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-white text-lg font-bold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full p-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isStudent"
              name="isStudent"
              checked={user.isStudent}
              onChange={handleChange}
              className="w-5 h-5 bg-gray-700 rounded focus:ring-green-500"
            />
            <label htmlFor="isStudent" className="text-white text-lg font-bold">
              I am a student
            </label>
          </div>
          
          {showUniversityId && (
            <div className="space-y-2">
              <label htmlFor="universityId" className="block text-white text-lg font-bold">
                University ID
              </label>
              <input
                type="text"
                id="universityId"
                name="universityId"
                value={user.universityId || ''}
                onChange={handleChange}
                className="w-full p-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
          
          <button
            type="submit"
            className="w-full p-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400 font-bold"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;