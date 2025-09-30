'use client';

import React, { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import MenuManagement from '../menu/MenuManagement';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Page Content */}
        <MenuManagement />
      </div>
    </div>
  );
}
