import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { TagService } from 'src/tag/tag.service';
import { Repository, Like } from 'typeorm';
import { CreatePostDto, QueryPostPageDto } from './dto/create-post.dto';
import { PostsEntity } from './posts.entity';

export interface PostsRo {
  list: PostsEntity[];
  count: number;
}
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
  ) {}

  // 创建文章
  async create(user: any, post: CreatePostDto) {
    const { title, tag, category = 0, status } = post;

    if (!title) {
      throw new HttpException('缺少文章标题', HttpStatus.BAD_REQUEST);
    }

    const doc = await this.postsRepository.findOne({ where: { title } });

    if (doc) {
      throw new HttpException('文章已存在', HttpStatus.BAD_REQUEST);
    }

    const categoryDoc = await this.categoryService.findById(category);
    const tags = await this.tagService.findByIds(('' + tag).split(','));
    const postParam: Partial<PostsEntity> = {
      ...post,
      category: categoryDoc,
      tags: tags,
      author: user,
    };

    // 发布
    if (status === 'publish') {
      Object.assign(postParam, {
        publishTime: new Date(),
      });
    }

    const newPost: PostsEntity = this.postsRepository.create({ ...postParam });
    const created = await this.postsRepository.save(newPost);

    return created.id;
  }

  // 获取文章列表
  async findAll(query: QueryPostPageDto) {
    const take = query.pageSize || 10;
    const page = query.pageNum || 1;
    const skip = (page - 1) * take;
    const keyword = query.keyword || '';

    const [result, total] = await this.postsRepository.findAndCount({
      where: { title: Like('%' + keyword + '%') },
      order: {
        createTime: 'DESC',
      },
      skip,
      take,
    });

    return {
      list: result.map((item) => item.toResponseObject()),
      count: total,
    };
  }

  // 获取指定id文章
  async findById(id: number) {
    const qb = this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.category', 'category')
      .leftJoinAndSelect('posts.tags', 'tag')
      .leftJoinAndSelect('posts.author', 'user')
      .where('posts.id=:id')
      .setParameter('id', id);

    const result = await qb.getOne();
    if (!result) {
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    }
    await this.postsRepository.update(id, { count: result.count + 1 });

    return result.toResponseObject();
  }

  // 更新指定id文章
  async updateById(id: number, post: CreatePostDto) {
    const existPost = await this.postsRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    }

    const { category, tag, status } = post;
    const tags = await this.tagService.findByIds(('' + tag).split(','));
    const categoryDoc = await this.categoryService.findById(category);
    const newPost = {
      ...post,
      category: categoryDoc,
      tags,
      publishTime: status === 'publish' ? new Date() : existPost.publishTime,
    };

    const updatePost = this.postsRepository.merge(existPost, newPost);
    return (await this.postsRepository.save(updatePost)).id;
  }

  // 删除指定id文章
  async remove(id: number) {
    const existPost = await this.postsRepository.findOneBy({ id });

    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    }

    return await this.postsRepository.delete(id);
  }
}
