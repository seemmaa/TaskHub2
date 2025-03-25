import React from 'react';

interface HeaderProps {
  username: string;
  isStudent: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, isStudent, onLogout }) => {
  return (
    <header className="bg-darkGray p-4 border-b border-gray-700 flex justify-end">
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold">
          {isStudent ? `Student ${username}` : `Admin ${username}`}
        </span>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700 h-8"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;