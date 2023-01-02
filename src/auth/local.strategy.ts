/*
 * @Description 本地策略验证账号和密码是否存在
 * @Author bihongbin
 * @Date 2022-11-28 16:18:01
 * @LastEditors bihongbin
 * @LastEditTime 2022-12-26 12:00:04
 */
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import * as bcryptjs from 'bcryptjs';
import { UserEntity } from 'src/user/entities/user.entity';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user') // 创建可用于生成SQL查询的新查询生成器
      .addSelect('user.password') // 向SELECT查询添加新选择
      .where('user.username=:username', { username }) // 在查询生成器中设置WHERE条件
      .getOne(); // 获取通过执行生成的查询生成器sql返回的单个实体
    if (!user) {
      throw new BadRequestException('用户名不正确！');
    }

    if (!bcryptjs.compareSync(password, user.password)) {
      throw new BadRequestException('密码错误！');
    }

    return user;
  }
}
