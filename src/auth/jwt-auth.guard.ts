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
