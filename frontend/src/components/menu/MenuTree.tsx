'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  PlusIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import { MenuItem } from '@/types';

interface MenuTreeProps {
  items: MenuItem[];
  onItemSelect: (item: MenuItem) => void;
  onAddItem: (parentId?: number) => void;
  onDeleteItem: (itemId: number) => void;
  selectedItem?: MenuItem | null;
  expandAll?: boolean;
  collapseAll?: boolean;
}

interface MenuTreeNodeProps {
  item: MenuItem;
  level: number;
  onItemSelect: (item: MenuItem) => void;
  onAddItem: (parentId?: number) => void;
  onDeleteItem: (itemId: number) => void;
  selectedItem?: MenuItem | null;
  expandAll?: boolean;
  collapseAll?: boolean;
}

function MenuTreeNode({ 
  item, 
  level, 
  onItemSelect, 
  onAddItem, 
  onDeleteItem, 
  selectedItem,
  expandAll,
  collapseAll 
}: MenuTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedItem?.id === item.id;

  useEffect(() => {
    if (expandAll) {
      setIsExpanded(true);
    }
  }, [expandAll]);

  useEffect(() => {
    if (collapseAll) {
      setIsExpanded(false);
    }
  }, [collapseAll]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleItemClick = () => {
    onItemSelect(item);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddItem(item.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteItem(item.id);
  };

  return (
    <div>
      <div 
        className={`
          group flex items-center py-2.5 px-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0
          ${isSelected ? 'bg-purple-50' : ''}
        `}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
        onClick={handleItemClick}
      >
        <button
          onClick={handleToggle}
          className="mr-2 p-0.5 hover:bg-gray-200 rounded flex-shrink-0"
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>
        
        <span className={`flex-1 text-sm text-gray-800 ${isSelected ? 'font-medium' : ''}`}>
          {item.title}
        </span>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddClick}
            className="p-1.5 hover:bg-purple-100 rounded-full transition-colors"
            title="Add child item"
          >
            <PlusIcon className="h-4 w-4 text-purple-600" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
            title="Delete item"
          >
            <TrashIcon className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {item.children!.map((child) => (
            <MenuTreeNode
              key={child.id}
              item={child}
              level={level + 1}
              onItemSelect={onItemSelect}
              onAddItem={onAddItem}
              onDeleteItem={onDeleteItem}
              selectedItem={selectedItem}
              expandAll={expandAll}
              collapseAll={collapseAll}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuTree({ 
  items, 
  onItemSelect, 
  onAddItem, 
  onDeleteItem, 
  selectedItem,
  expandAll,
  collapseAll 
}: MenuTreeProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {items.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No items found. Click the + button to add items.
        </div>
      ) : (
        items.map((item) => (
          <MenuTreeNode
            key={item.id}
            item={item}
            level={0}
            onItemSelect={onItemSelect}
            onAddItem={onAddItem}
            onDeleteItem={onDeleteItem}
            selectedItem={selectedItem}
            expandAll={expandAll}
            collapseAll={collapseAll}
          />
        ))
      )}
    </div>
  );
}
