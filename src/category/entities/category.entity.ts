import { PostsEntity } from 'src/posts/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('category')
export class CategoryEntity {
  // 标记为主列，值自动生成
  @PrimaryGeneratedColumn()
  id: number;

  // 分类名称
  @Column()
  name: string;

  @OneToMany(() => PostsEntity, (post) => post.category)
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
