import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isStudent: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isStudent }) => {
  const navItems = [
    { path: '/home', name: 'Home' },
    { path: '/projects', name: 'Projects' },
    { path: '/tasks', name: 'Tasks' },
    { path: '/chat', name: 'Chat' },
  ];

  return (
    <nav className="w-60 bg-gray-800 p-5">
      <ul>
        {navItems.map((item) => (
          <li key={item.path} className="mb-3">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block p-4 rounded-md transition-colors ${isActive
                  ? 'bg-blue-600 font-bold'
                  : 'bg-gray-700 hover:bg-gray-600'}`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;