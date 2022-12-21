import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

// SetMetadata作用：将获取到的值，设置到元数据中，然后守卫通过反射器才能获取到值
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext) {
    // 获取路由角色
    const roles = this.reflector.get('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    // 读取user
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      return false;
    }

    // 判断用户的角色是否包含和roles相同的角色列表，并返回一个布尔类型
    const hasRoles = roles.some((role: string) => role === user.role);
    if (!hasRoles) {
      throw new UnauthorizedException('您没有权限');
    }
    return hasRoles;
  }
}
