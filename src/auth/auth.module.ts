import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthValidationMiddleware } from './middleware/authValidationMiddleware';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from 'src/user/entities/user.entity';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { RedisCacheModule } from 'src/core/db/redis-cache.module';
import { UserService } from 'src/user/user.service';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('SECRET'),
    };
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    jwtModule,
    UserModule,
    RedisCacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
  exports: [jwtModule],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthValidationMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
