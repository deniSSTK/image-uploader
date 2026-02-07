import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [PrismaModule, ConfigModule, CacheModule],
})
export class CoreModule {}
