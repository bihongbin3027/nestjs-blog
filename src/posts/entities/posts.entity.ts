import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { Exclude } from 'class-transformer';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { PostInfoDto } from '../dto/create-post.dto';

@Entity('posts')
export class PostsEntity {
  // 标记为主列，值自动生成
  @PrimaryGeneratedColumn()
  id: number;

  // 文章标题
  @Column({ length: 50 })
  title: string;

  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  content: string;

  // markdown 转 html，自动生成
  @Column({ type: 'mediumtext', default: null, name: 'content_html' })
  contentHtml: string;

  // 摘要，自动生成
  @Column({ type: 'text', default: null })
  summary: string;

  // 封面图
  @Column({ default: null, name: 'cover_url' })
  coverUrl: string;

  // 阅读量
  @Column({ type: 'int', default: 0 })
  count: number;

  // 点赞量
  @Column({ type: 'int', default: 0, name: 'like_count' })
  likeCount: number;

  // 推荐显示
  @Column({ type: 'tinyint', default: 0, name: 'is_recommend' })
  isRecommend: number;

  // 文章状态
  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string;

  // 作者
  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({
    name: 'author_id',
  })
  author: UserEntity;

  // 分类id
  @Exclude()
  @ManyToOne(() => CategoryEntity, (category) => category.posts)
  @JoinColumn({
    name: 'category_id',
  })
  category: CategoryEntity;

  // 标签id
  @ManyToMany(() => TagEntity, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tag',
    joinColumns: [{ name: 'post_id' }],
    inverseJoinColumns: [{ name: 'tag_id' }],
  })
  tags: TagEntity[];

  @Column({
    type: 'timestamp',
    comment: '发布时间',
    name: 'publish_time',
    default: null,
  })
  publishTime: Date;

  @Column({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    type: 'timestamp',
    comment: '更新时间',
    name: 'update_time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  // 返回数据格式化
  toResponseObject(): PostInfoDto {
    const responseObj = {
      ...this,
    } as unknown as PostInfoDto;

    if (this.author && this.author.id) {
      responseObj.userId = this.author.id;
      responseObj.author = this.author.nickname || this.author.username;
    }

    return responseObj;
  }
}
