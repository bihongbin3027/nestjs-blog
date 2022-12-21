import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('文章分类')
@ApiBearerAuth()
@Controller('category')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '创建分类' })
  @Post()
  async create(@Body() body: CreateCategoryDto) {
    return await this.categoryService.create(body.name);
  }
}
