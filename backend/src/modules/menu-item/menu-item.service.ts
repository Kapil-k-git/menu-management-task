import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from '../../common/dto/menu.dto';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    // Verify menu exists
    const menu = await this.prisma.menu.findUnique({
      where: { id: createMenuItemDto.menuId },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${createMenuItemDto.menuId} not found`);
    }

    // If parentId is provided, verify parent exists
    if (createMenuItemDto.parentId) {
      const parent = await this.prisma.menuItem.findUnique({
        where: { id: createMenuItemDto.parentId },
      });

      if (!parent) {
        throw new NotFoundException(`Parent menu item with ID ${createMenuItemDto.parentId} not found`);
      }

      // Ensure parent belongs to the same menu
      if (parent.menuId !== createMenuItemDto.menuId) {
        throw new BadRequestException('Parent menu item must belong to the same menu');
      }
    }

    // Get the next order number for the same parent
    const lastOrder = await this.prisma.menuItem.findFirst({
      where: {
        menuId: createMenuItemDto.menuId,
        parentId: createMenuItemDto.parentId || null,
      },
      orderBy: { order: 'desc' },
    });

    const order = lastOrder ? lastOrder.order + 1 : 0;

    return this.prisma.menuItem.create({
      data: {
        ...createMenuItemDto,
        order,
      },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findAll(menuId?: number) {
    const where = menuId ? { menuId } : {};
    
    return this.prisma.menuItem.findMany({
      where,
      include: {
        parent: true,
        children: {
          orderBy: { order: 'asc' },
        },
        menu: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { order: 'asc' },
        },
        menu: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return menuItem;
  }

  async update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    const existingItem = await this.findOne(id);

    // If parentId is being changed, validate it
    if (updateMenuItemDto.parentId !== undefined) {
      if (updateMenuItemDto.parentId !== null) {
        const parent = await this.prisma.menuItem.findUnique({
          where: { id: updateMenuItemDto.parentId },
        });

        if (!parent) {
          throw new NotFoundException(`Parent menu item with ID ${updateMenuItemDto.parentId} not found`);
        }

        // Ensure parent belongs to the same menu
        if (parent.menuId !== existingItem.menuId) {
          throw new BadRequestException('Parent menu item must belong to the same menu');
        }

        // Prevent circular reference
        if (parent.id === id) {
          throw new BadRequestException('Menu item cannot be its own parent');
        }
      }
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: updateMenuItemDto,
      include: {
        parent: true,
        children: {
          orderBy: { order: 'asc' },
        },
        menu: true,
      },
    });
  }

  async remove(id: number) {
    const existingItem = await this.findOne(id);

    // Check if item has children
    const childrenCount = await this.prisma.menuItem.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new BadRequestException('Cannot delete menu item with children. Delete children first.');
    }

    return this.prisma.menuItem.delete({
      where: { id },
    });
  }

  async reorder(menuId: number, itemIds: number[]) {
    // Verify all items belong to the same menu
    const items = await this.prisma.menuItem.findMany({
      where: {
        id: { in: itemIds },
        menuId,
      },
    });

    if (items.length !== itemIds.length) {
      throw new BadRequestException('Some menu items not found or belong to different menu');
    }

    // Update order for each item
    const updates = itemIds.map((id, index) =>
      this.prisma.menuItem.update({
        where: { id },
        data: { order: index },
      })
    );

    return Promise.all(updates);
  }

  async getHierarchy(menuId: number) {
    const items = await this.prisma.menuItem.findMany({
      where: { menuId },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return this.buildHierarchy(items);
  }

  private buildHierarchy(items: any[]): any[] {
    const itemMap = new Map();
    const rootItems: any[] = [];

    // Create a map of all items
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Build hierarchy
    items.forEach(item => {
      if (item.parentId) {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children.push(itemMap.get(item.id));
        }
      } else {
        rootItems.push(itemMap.get(item.id));
      }
    });

    return rootItems;
  }
}
