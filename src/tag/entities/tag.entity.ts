import { PostsEntity } from 'src/posts/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tag')
export class TagEntity {
  // 标记为主列，值自动生成
  @PrimaryGeneratedColumn()
  id: number;

  // 标签名
  @Column()
  name: string;

  @ManyToMany(() => PostsEntity, (post) => post.tags)
  posts: PostsEntity[];

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_time',
  })
  createTime: Date;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    name: 'update_time',
  })
  updateTime: Date;
}
