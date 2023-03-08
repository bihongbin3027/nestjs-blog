/*
 * @Description 守卫添加jwt策略(jwt.strategy.ts)验证
 * @Author bihongbin
 * @Date 2022-12-01 14:43:13
 * @LastEditors bihongbin
 * @LastEditTime 2023-03-08 10:58:33
 */
import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<UserEntity>(err: any, user: UserEntity) {
    if (err || !user) {
      throw new UnauthorizedException('身份验证失败');
    }

    return user;
  }
}
