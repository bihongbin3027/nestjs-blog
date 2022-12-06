import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { RedisCacheService } from 'src/core/db/redis-cache.service';

export class JwtStorage extends PassportStrategy(Strategy) {
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
    const cacheToken = await this.redisCacheService.cacheGet(tokenKey);

    if (!cacheToken) {
      throw new UnauthorizedException('token 已过期');
    }

    if (token !== cacheToken) {
      throw new UnauthorizedException('token不正确');
    }

    const existUser = await this.authService.getUser(user);
    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }

    this.redisCacheService.cacheSet(tokenKey, token, 1800);

    return existUser;
  }
}
