import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

@Global()
@Module({
  providers: [
    {
      provide: CacheService,
      useExisting: RedisService,
    },
  ],
  imports: [RedisModule],
  exports: [CacheService],
})
export class CacheModule {}
