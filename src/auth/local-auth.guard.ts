/*
 * @Description 守卫添加本地策略(local.strategy.ts)验证
 * @Author bihongbin
 * @Date 2022-11-28 16:18:01
 * @LastEditors bihongbin
 * @LastEditTime 2023-03-08 09:58:50
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
