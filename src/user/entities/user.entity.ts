import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { PostsEntity } from 'src/posts/posts.entity';

@Entity('user')
export class UserEntity {
  // 标记为主列，值自动生成
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 用户名
  @Column({ length: 100, nullable: true })
  username: string;

  // 昵称
  @Column({ length: 100, nullable: true })
  nickname: string;

  // 密码
  @Exclude() // 将给定类或属性标记为排除
  @Column({ select: false, nullable: true })
  password: string;

  // 头像
  @Column({ default: null })
  avatar: string;

  // 邮箱
  @Column({ default: null })
  email: string;

  // 用户角色
  @Column('simple-enum', {
    enum: ['root', 'author', 'visitor'],
    default: 'visitor',
  })
  role: string;

  @OneToMany(() => PostsEntity, (posts) => posts.author)
  posts: PostsEntity[];

  @Column({
    name: 'create_time',
    comment: '创建时间',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Exclude()
  @Column({
    name: 'update_time',
    comment: '更新时间',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await bcrypt.hashSync(this.password, 10); // 数据插入数据库之前加密
  }
}
