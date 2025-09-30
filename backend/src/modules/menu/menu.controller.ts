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
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from '../../common/dto/menu.dto';

@ApiTags('menus')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiResponse({ status: 201, description: 'Menu created successfully' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menus' })
  @ApiResponse({ status: 200, description: 'List of all menus' })
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific menu' })
  @ApiResponse({ status: 200, description: 'Menu found' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Get(':id/hierarchy')
  @ApiOperation({ summary: 'Get menu with hierarchical structure' })
  @ApiResponse({ status: 200, description: 'Menu hierarchy found' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  getHierarchy(
    @Param('id', ParseIntPipe) id: number,
    @Query('depth') depth?: number,
  ) {
    return this.menuService.getMenuWithDepth(id, depth);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a menu' })
  @ApiResponse({ status: 200, description: 'Menu updated successfully' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a menu' })
  @ApiResponse({ status: 200, description: 'Menu deleted successfully' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}
