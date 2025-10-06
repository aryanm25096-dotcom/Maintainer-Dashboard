import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApp } from '../../contexts/AppContext';

export function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useApp();

  // Get current page from URL path
  const currentPage = location.pathname.substring(1) || 'overview';

  // Handle navigation
  const handleNavigate = (page) => {
    navigate(`/${page}`);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} />
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
