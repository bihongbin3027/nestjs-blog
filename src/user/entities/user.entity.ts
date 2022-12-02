import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Entity('user')
export class UserEntity {
  @ApiProperty({ description: '用户id' })
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 100, nullable: true })
  username: string; // 用户名

  @Column({ length: 100, nullable: true })
  nickname: string; // 昵称

  @Exclude() // 将给定类或属性标记为排除
  @Column({ select: false, nullable: true })
  password: string; // 密码

  @Column({ default: null })
  avatar: string; // 头像

  @Column({ default: null })
  email: string; // 邮箱

  @Column('simple-enum', { enum: ['root', 'author', 'visitor'] })
  role: string; // 用户角色

  @Column({
    name: 'create_tile',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await bcrypt.hashSync(this.password, 10); // 数据插入数据库之前加密
  }
}
