import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PostsService, PostsRo } from './posts.service';
import { CreatePostDto, QueryPostPageDto } from './dto/create-post.dto';

@ApiTags('文章')
@Controller('posts')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '创建文章' })
  @Post()
  async create(@Body() post: CreatePostDto) {
    return await this.postsService.create(post);
  }

  @ApiOperation({ summary: '获取文章列表' })
  @Get()
  async findAll(@Query() query: QueryPostPageDto): Promise<PostsRo> {
    return await this.postsService.findAll(query);
  }

  @ApiOperation({ summary: '获取指定id文章' })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<CreatePostDto | null> {
    return await this.postsService.findById(+id);
  }

  @ApiOperation({ summary: '更新指定id文章' })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() post: CreatePostDto,
  ): Promise<CreatePostDto> {
    return await this.postsService.updateById(+id, post);
  }

  @ApiOperation({ summary: '删除指定id文章' })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.postsService.remove(+id);
  }
}
