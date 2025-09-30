export interface Menu {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: number;
  title: string;
  description?: string;
  url?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  parentId?: number;
  menuId: number;
  createdAt: string;
  updatedAt: string;
  children?: MenuItem[];
  parent?: MenuItem;
}

export interface CreateMenuDto {
  name: string;
  description?: string;
}

export interface UpdateMenuDto {
  name?: string;
  description?: string;
}

export interface CreateMenuItemDto {
  title: string;
  description?: string;
  url?: string;
  icon?: string;
  order?: number;
  parentId?: number;
  menuId: number;
}

export interface UpdateMenuItemDto {
  title?: string;
  description?: string;
  url?: string;
  icon?: string;
  order?: number;
  parentId?: number;
  isActive?: boolean;
}

export interface MenuState {
  menus: Menu[];
  currentMenu: Menu | null;
  selectedMenuItem: MenuItem | null;
  loading: boolean;
  error: string | null;
}
