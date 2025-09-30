import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMenuDto, UpdateMenuDto } from '../../common/dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    const menu = await this.prisma.menu.create({
      data: createMenuDto,
    });

    // Create root item for the menu
    await this.prisma.menuItem.create({
      data: {
        title: 'Root',
        menuId: menu.id,
        parentId: null,
        order: 0,
      },
    });

    return menu;
  }

  async findAll() {
    return this.prisma.menu.findMany({
      include: {
        items: {
          where: { parentId: null },
          include: {
            children: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    // Get all menu items for this menu
    const items = await this.prisma.menuItem.findMany({
      where: { menuId: id },
      orderBy: { order: 'asc' },
    });

    // Build the hierarchy
    const hierarchy = this.buildHierarchy(items);

    return {
      ...menu,
      items: hierarchy,
    };
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const existingMenu = await this.findOne(id);
    
    return this.prisma.menu.update({
      where: { id },
      data: updateMenuDto,
    });
  }

  async remove(id: number) {
    const existingMenu = await this.findOne(id);
    
    return this.prisma.menu.delete({
      where: { id },
    });
  }

  async getMenuWithDepth(id: number, depth?: number) {
    const menu = await this.findOne(id);
    
    if (depth && depth > 0) {
      return this.buildHierarchy(menu.items, depth);
    }
    
    return menu;
  }

  private buildHierarchy(items: any[], maxDepth?: number, currentDepth = 0): any[] {
    if (maxDepth && currentDepth >= maxDepth) {
      return items.map(item => ({ ...item, children: [] }));
    }

    // Group items by parentId
    const itemMap = new Map<number, any>();
    const rootItems: any[] = [];

    // First pass: create a map of all items
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: build the hierarchy
    items.forEach(item => {
      if (item.parentId === null) {
        const itemData = itemMap.get(item.id);
        if (itemData) {
          rootItems.push(itemData);
        }
      } else {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          const itemData = itemMap.get(item.id);
          if (itemData) {
            parent.children.push(itemData);
          }
        }
      }
    });

    return rootItems;
  }
}
