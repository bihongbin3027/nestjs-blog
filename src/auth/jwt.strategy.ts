/*
 * @Description jwt策略则是验证用户登陆时附带的token是否匹配和有效
 * @Author bihongbin
 * @Date 2022-12-01 14:43:13
 * @LastEditors bihongbin
 * @LastEditTime 2023-03-08 11:09:42
 */
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { RedisCacheService } from 'src/core/db/redis-cache.service';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET'),
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(req: any, user: UserEntity) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const tokenKey = `${user.id}&${user.username}&${user.role}`;

    const existUser = await this.authService.getUser(user);
    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }

    if (token) {
      this.redisCacheService.cacheSet(tokenKey, token, 1800); // 更新redis token
    }

    return existUser;
  }
}
