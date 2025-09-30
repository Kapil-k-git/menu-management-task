import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from '../../common/dto/menu.dto';

@ApiTags('menu-items')
@Controller('menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, description: 'Menu item created successfully' })
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menu items' })
  @ApiResponse({ status: 200, description: 'List of all menu items' })
  findAll(@Query('menuId') menuId?: number) {
    return this.menuItemService.findAll(menuId);
  }

  @Get('hierarchy/:menuId')
  @ApiOperation({ summary: 'Get menu items hierarchy for a specific menu' })
  @ApiResponse({ status: 200, description: 'Menu items hierarchy found' })
  getHierarchy(@Param('menuId', ParseIntPipe) menuId: number) {
    return this.menuItemService.getHierarchy(menuId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific menu item' })
  @ApiResponse({ status: 200, description: 'Menu item found' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a menu item' })
  @ApiResponse({ status: 200, description: 'Menu item updated successfully' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemService.update(id, updateMenuItemDto);
  }

  @Patch('reorder/:menuId')
  @ApiOperation({ summary: 'Reorder menu items' })
  @ApiResponse({ status: 200, description: 'Menu items reordered successfully' })
  reorder(
    @Param('menuId', ParseIntPipe) menuId: number,
    @Body() body: { itemIds: number[] },
  ) {
    return this.menuItemService.reorder(menuId, body.itemIds);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiResponse({ status: 200, description: 'Menu item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemService.remove(id);
  }
}
