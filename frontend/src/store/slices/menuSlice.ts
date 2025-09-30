import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Menu, MenuItem, MenuState, CreateMenuDto, UpdateMenuDto, CreateMenuItemDto, UpdateMenuItemDto } from '@/types';

const initialState: MenuState = {
  menus: [],
  currentMenu: null,
  selectedMenuItem: null,
  loading: false,
  error: null,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to handle fetch with retry
const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
};

// Fetch all menus
export const fetchMenus = createAsyncThunk(
  'menu/fetchMenus',
  async () => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/menus`);
      return response.json();
    } catch (error) {
      console.error('Failed to fetch menus:', error);
      throw new Error('Failed to fetch menus. Please check if the backend server is running.');
    }
  }
);

// Fetch menu by ID with hierarchy
export const fetchMenuById = createAsyncThunk(
  'menu/fetchMenuById',
  async (id: number) => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/menus/${id}`);
      return response.json();
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      throw new Error('Failed to fetch menu. Please check if the backend server is running.');
    }
  }
);

// Create menu
export const createMenu = createAsyncThunk(
  'menu/createMenu',
  async (menuData: CreateMenuDto) => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/menus`, {
        method: 'POST',
        body: JSON.stringify(menuData),
      });
      return response.json();
    } catch (error) {
      console.error('Failed to create menu:', error);
      throw new Error('Failed to create menu. Please check if the backend server is running.');
    }
  }
);

// Update menu
export const updateMenu = createAsyncThunk(
  'menu/updateMenu',
  async ({ id, data }: { id: number; data: UpdateMenuDto }) => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/menus/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error('Failed to update menu:', error);
      throw new Error('Failed to update menu. Please check if the backend server is running.');
    }
  }
);

// Delete menu
export const deleteMenu = createAsyncThunk(
  'menu/deleteMenu',
  async (id: number) => {
    try {
      await fetchWithRetry(`${API_BASE_URL}/menus/${id}`, {
        method: 'DELETE',
      });
      return id;
    } catch (error) {
      console.error('Failed to delete menu:', error);
      throw new Error('Failed to delete menu. Please check if the backend server is running.');
    }
  }
);

// Create menu item
export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async (itemData: CreateMenuItemDto) => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/menu-items`, {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
      const newItem = await response.json();
      
      // Return both the new item and the menuId for refreshing
      return { newItem, menuId: itemData.menuId };
    } catch (error) {
      console.error('Failed to create menu item:', error);
      throw new Error('Failed to create menu item. Please check if the backend server is running.');
    }
  }
);

// Update menu item
export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async ({ id, data }: { id: number; data: UpdateMenuItemDto }) => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/menu-items/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error('Failed to update menu item:', error);
      throw new Error('Failed to update menu item. Please check if the backend server is running.');
    }
  }
);

// Delete menu item
export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async (id: number) => {
    try {
      await fetchWithRetry(`${API_BASE_URL}/menu-items/${id}`, {
        method: 'DELETE',
      });
      return id;
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      throw new Error('Failed to delete menu item. Please check if the backend server is running.');
    }
  }
);

// Helper function to add item to menu hierarchy - FIXED VERSION
const addItemToMenu = (items: MenuItem[], newItem: MenuItem, parentId?: number): MenuItem[] => {
  console.log('Adding item to menu:', { newItem, parentId, items });
  
  // If no parentId, add as root item
  if (!parentId) {
    console.log('Adding as root item');
    return [...items, newItem];
  }
  
  // Recursively search and add to the correct parent
  const result = items.map(item => {
    // If this is the parent, add the new item to its children
    if (item.id === parentId) {
      console.log('Found parent, adding to children:', item.title);
      return {
        ...item,
        children: [...(item.children || []), newItem]
      };
    }
    
    // If this item has children, recursively search them
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: addItemToMenu(item.children, newItem, parentId)
      };
    }
    
    // Return unchanged if not the parent and has no children
    return item;
  });
  
  console.log('Result after adding:', result);
  return result;
};

// Helper function to remove item from menu hierarchy
const removeItemFromMenu = (items: MenuItem[], itemId: number): MenuItem[] => {
  return items.filter(item => item.id !== itemId)
    .map(item => ({
      ...item,
      children: item.children ? removeItemFromMenu(item.children, itemId) : []
    }));
};

// Helper function to update item in menu hierarchy
const updateItemInMenu = (items: MenuItem[], updatedItem: MenuItem): MenuItem[] => {
  return items.map(item => {
    if (item.id === updatedItem.id) {
      return updatedItem;
    }
    if (item.children) {
      return {
        ...item,
        children: updateItemInMenu(item.children, updatedItem)
      };
    }
    return item;
  });
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setCurrentMenu: (state, action: PayloadAction<Menu | null>) => {
      state.currentMenu = action.payload;
    },
    setSelectedMenuItem: (state, action: PayloadAction<MenuItem | null>) => {
      state.selectedMenuItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch menus
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menus';
      })
      // Fetch menu by ID
      .addCase(fetchMenuById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMenu = action.payload;
      })
      .addCase(fetchMenuById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menu';
      })
      // Create menu
      .addCase(createMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menus.push(action.payload);
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create menu';
      })
      // Update menu
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.menus.findIndex(menu => menu.id === action.payload.id);
        if (index !== -1) {
          state.menus[index] = action.payload;
        }
        if (state.currentMenu?.id === action.payload.id) {
          state.currentMenu = action.payload;
        }
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update menu';
      })
      // Delete menu
      .addCase(deleteMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = state.menus.filter(menu => menu.id !== action.payload);
        if (state.currentMenu?.id === action.payload) {
          state.currentMenu = null;
          state.selectedMenuItem = null;
        }
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete menu';
      })
      // Create menu item - FIXED
      .addCase(createMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        const { newItem, menuId } = action.payload;
        
        console.log('createMenuItem.fulfilled:', { newItem, menuId, currentMenuId: state.currentMenu?.id });
        
        // Add the new item to the current menu if it matches
        if (state.currentMenu && state.currentMenu.id === menuId) {
          console.log('Adding item to current menu');
          state.currentMenu.items = addItemToMenu(state.currentMenu.items, newItem, newItem.parentId);
        } else {
          console.log('Menu ID mismatch or no current menu');
        }
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create menu item';
      })
      // Update menu item
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentMenu) {
          state.currentMenu.items = updateItemInMenu(state.currentMenu.items, action.payload);
        }
        if (state.selectedMenuItem?.id === action.payload.id) {
          state.selectedMenuItem = action.payload;
        }
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update menu item';
      })
      // Delete menu item
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentMenu) {
          state.currentMenu.items = removeItemFromMenu(state.currentMenu.items, action.payload);
        }
        if (state.selectedMenuItem?.id === action.payload) {
          state.selectedMenuItem = null;
        }
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete menu item';
      });
  },
});

export const { setCurrentMenu, setSelectedMenuItem, clearError } = menuSlice.actions;
export default menuSlice.reducer;
