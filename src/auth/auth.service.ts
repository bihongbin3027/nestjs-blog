import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RedisCacheService } from 'src/core/db/redis-cache.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private redisCacheService: RedisCacheService,
  ) {}

  // 生成token
  createToken(user: Partial<UserEntity>) {
    return this.jwtService.sign(user);
  }

  async login(user: Partial<UserEntity>) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    await this.redisCacheService.cacheSet(
      `${user.id}&${user.username}&${user.role}`,
      token,
      1800,
    );

    return { token };
  }

  async getUser(user: UserEntity) {
    return await this.userService.findOne(user.id);
  }
}
