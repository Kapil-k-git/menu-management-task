'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { 
  fetchMenus, 
  fetchMenuById, 
  createMenu, 
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setCurrentMenu,
  setSelectedMenuItem 
} from '@/store/slices/menuSlice';
import { MenuItem, CreateMenuDto, CreateMenuItemDto, UpdateMenuItemDto } from '@/types';
import MenuTree from './MenuTree';
import MenuItemForm from './MenuItemForm';
import { useMenuPolling } from '@/hooks/useMenuPolling';

export default function MenuManagement() {
  const dispatch = useAppDispatch();
  const { menus, currentMenu, selectedMenuItem, loading, error } = useAppSelector(state => state.menu);
  
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(false);
  const [collapseAll, setCollapseAll] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pollingEnabled, setPollingEnabled] = useState(false); // Disabled for now

  // Enable polling when a menu is selected (disabled for debugging)
  useMenuPolling(pollingEnabled ? 5000 : 0);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await dispatch(fetchMenus()).unwrap();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  const handleMenuSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const menuId = Number(e.target.value);
    if (menuId) {
      setSelectedMenuId(menuId);
      dispatch(fetchMenuById(menuId));
      dispatch(setSelectedMenuItem(null));
      setPollingEnabled(false); // Disabled for debugging
    } else {
      setPollingEnabled(false);
    }
  };

  const handleItemSelect = (item: MenuItem) => {
    dispatch(setSelectedMenuItem(item));
  };

  const handleExpandAll = () => {
    setExpandAll(true);
    setCollapseAll(false);
    setTimeout(() => setExpandAll(false), 100);
  };

  const handleCollapseAll = () => {
    setCollapseAll(true);
    setExpandAll(false);
    setTimeout(() => setCollapseAll(false), 100);
  };

  const handleAddItem = async (parentId?: number) => {
    if (!currentMenu) return;
    
    const title = prompt('Enter menu item title:');
    if (!title) return;

    console.log('Creating menu item:', { title, menuId: currentMenu.id, parentId });

    const newItem: CreateMenuItemDto = {
      title,
      menuId: currentMenu.id,
      parentId: parentId || undefined,
    };

    try {
      console.log('Dispatching createMenuItem...');
      await dispatch(createMenuItem(newItem)).unwrap();
      console.log('createMenuItem completed');
    } catch (error) {
      console.error('Failed to create menu item:', error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await dispatch(deleteMenuItem(itemId)).unwrap();
    } catch (error) {
      console.error('Failed to delete menu item:', error);
    }
  };

  const handleSaveItem = async (data: UpdateMenuItemDto) => {
    if (selectedMenuItem) {
      try {
        await dispatch(updateMenuItem({ id: selectedMenuItem.id, data })).unwrap();
      } catch (error) {
        console.error('Failed to update menu item:', error);
      }
    }
  };

  // Manual refresh function for testing
  const handleManualRefresh = () => {
    if (currentMenu) {
      console.log('Manual refresh triggered');
      dispatch(fetchMenuById(currentMenu.id));
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <span>Menus</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
            {currentMenu && (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${pollingEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-500">
                  {pollingEnabled ? 'Auto-refresh ON (5s)' : 'Auto-refresh OFF'}
                </span>
                <button
                  onClick={handleManualRefresh}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Refresh Now
                </button>
                <button
                  onClick={() => setPollingEnabled(!pollingEnabled)}
                  className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  {pollingEnabled ? 'Disable Polling' : 'Enable Polling'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 p-6 space-y-4 overflow-y-auto">
          {/* Menu Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menu
            </label>
            <select
              value={selectedMenuId || ''}
              onChange={handleMenuSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
            >
              <option value="">Select a menu</option>
              {menus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleExpandAll}
              disabled={!currentMenu}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              disabled={!currentMenu}
              className="flex-1 px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Collapse All
            </button>
          </div>

          {/* Menu Tree */}
          <div className="flex-1">
            {currentMenu ? (
              <MenuTree
                items={currentMenu.items}
                onItemSelect={handleItemSelect}
                onAddItem={handleAddItem}
                onDeleteItem={handleDeleteItem}
                selectedItem={selectedMenuItem}
                expandAll={expandAll}
                collapseAll={collapseAll}
              />
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Select a menu to view its items</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-6 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <MenuItemForm
            item={selectedMenuItem}
            onSave={handleSaveItem}
            onDelete={handleDeleteItem}
          />
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-50 max-w-md shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => dispatch({ type: 'menu/clearError' })}
              className="ml-4 text-red-500 hover:text-red-700 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
