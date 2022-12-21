import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';

@ApiTags('文章标签')
@ApiBearerAuth()
@Controller('tag')
@UseGuards(AuthGuard('jwt'))
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '创建标签' })
  @Post()
  async create(@Body() body: CreateTagDto) {
    return this.tagService.create(body.name);
  }
}
