'use client';

import React from 'react';
import { 
  FolderIcon, 
  Squares2X2Icon, 
  CodeBracketIcon,
  ListBulletIcon,
  UserGroupIcon,
  TrophyIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { name: 'Systems', icon: FolderIcon, active: false },
  { name: 'System Code', icon: CodeBracketIcon, active: false },
  { name: 'Properties', icon: Squares2X2Icon, active: false },
  { name: 'Menus', icon: Squares2X2Icon, active: true },
  { name: 'API List', icon: ListBulletIcon, active: false },
  { name: 'Users & Group', icon: UserGroupIcon, active: false },
  { name: 'Competition', icon: TrophyIcon, active: false },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-56 bg-[#1e293b] transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-6 h-6">
                <path fill="#000" d="M8 4 L8 28 L12 28 L12 8 L24 8 L24 4 Z M16 12 L16 28 L20 28 L20 16 L24 16 L24 12 Z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">CLOIT</span>
          </div>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-4 px-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <a
                    href="#"
                    className={`
                      flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm
                      ${item.active 
                        ? 'bg-green-500 text-white font-medium' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
