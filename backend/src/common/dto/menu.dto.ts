import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ description: 'Menu name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Menu description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateMenuDto {
  @ApiPropertyOptional({ description: 'Menu name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Menu description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateMenuItemDto {
  @ApiProperty({ description: 'Menu item title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Menu item description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Menu item URL' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: 'Menu item icon' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Menu item order' })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ description: 'Parent menu item ID' })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiProperty({ description: 'Menu ID' })
  @IsInt()
  menuId: number;
}

export class UpdateMenuItemDto {
  @ApiPropertyOptional({ description: 'Menu item title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Menu item description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Menu item URL' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: 'Menu item icon' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Menu item order' })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ description: 'Parent menu item ID' })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  isActive?: boolean;
}
