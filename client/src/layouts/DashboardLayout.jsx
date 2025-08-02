import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import { useState } from 'react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-grow p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 