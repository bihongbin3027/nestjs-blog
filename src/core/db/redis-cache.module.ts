import { ConfigService } from '@nestjs/config';
import { Module, CacheModule, CacheStore } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [
    // 连接redis
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: +configService.get('REDIS_PORT'),
          },
          ttl: 60 * 30,
        });

        return {
          store: () => store,
        } as unknown as CacheStore;
      },
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
