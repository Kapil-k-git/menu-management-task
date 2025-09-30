'use client';

import React, { useState, useEffect } from 'react';
import { MenuItem, UpdateMenuItemDto } from '@/types';

interface MenuItemFormProps {
  item: MenuItem | null;
  onSave: (data: UpdateMenuItemDto) => void;
  onDelete: (itemId: number) => void;
}

function calculateDepth(item: MenuItem): number {
  let depth = 0;
  let currentItem: MenuItem | undefined = item;
  
  while (currentItem?.parentId) {
    depth++;
    currentItem = currentItem.parent;
  }
  
  return depth;
}

function getParentName(item: MenuItem): string {
  if (!item.parentId) {
    return 'Root';
  }
  return item.parent?.title || 'Unknown';
}

export default function MenuItemForm({ item, onSave, onDelete }: MenuItemFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    icon: '',
    isActive: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || "",
        url: item.url || "",
        icon: item.icon || "",
        isActive: item.isActive,
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      onSave(formData);
    }
  };

  const handleDelete = () => {
    if (item) {
      onDelete(item.id);
    }
  };

  if (!item) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm">Select a menu item to edit</p>
        </div>
      </div>
    );
  }

  const depth = calculateDepth(item);
  const parentName = getParentName(item);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Menu ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Menu ID
          </label>
          <input
            type="text"
            value={item.id}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-sm"
          />
        </div>

        {/* Depth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Depth
          </label>
          <input
            type="text"
            value={depth}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-sm"
          />
        </div>

        {/* Parent Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Parent Data
          </label>
          <input
            type="text"
            value={parentName}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-sm"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Name *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2 py-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">
            Active
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors font-medium text-sm"
          >
            Save
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            className="w-full bg-white text-red-600 border border-red-600 py-3 px-4 rounded-lg hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium text-sm"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
