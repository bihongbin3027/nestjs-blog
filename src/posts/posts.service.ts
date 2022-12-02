import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { QueryPostPageDto } from './dto/create-post.dto';
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
  ) {}

  // 创建文章
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    const { title } = post;

    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }

    const doc = await this.postsRepository.findOne({ where: { title } });

    if (doc) {
      throw new HttpException('文章已存在', 401);
    }

    const newPost = this.postsRepository.create(post);

    return await this.postsRepository.save(newPost);
  }

  // 获取文章列表
  async findAll(query: QueryPostPageDto): Promise<PostsRo> {
    const take = query.pageSize || 10;
    const page = query.pageNum || 1;
    const skip = (page - 1) * take;
    const keyword = query.keyword || '';

    const [result, total] = await this.postsRepository.findAndCount({
      where: { title: Like('%' + keyword + '%') },
      order: {
        create_time: 'DESC',
      },
      skip,
      take,
    });

    return { list: result, count: total };
  }

  // 获取指定id文章
  async findById(id: number): Promise<PostsEntity | null> {
    return await this.postsRepository.findOneBy({ id });
  }

  // 更新指定id文章
  async updateById(
    id: number,
    post: Partial<PostsEntity>,
  ): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOneBy({ id });

    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }

    const updatePost = this.postsRepository.merge(existPost, post);

    return this.postsRepository.save(updatePost);
  }

  // 删除指定id文章
  async remove(id: number) {
    const existPost = await this.postsRepository.findOneBy({ id });

    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }

    return await this.postsRepository.delete(id);
  }
}
