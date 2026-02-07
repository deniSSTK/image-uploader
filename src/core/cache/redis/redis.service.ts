import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '../../config/config.service';
import { CacheService } from '../cache.service';

@Injectable()
export class RedisService
  extends CacheService
  implements OnModuleInit, OnModuleDestroy
{
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {
    super();
    this.prefix = this.configService.get('REDIS_APP_KEY');
  }

  async onModuleInit() {
    this.client = createClient({
      url: this.configService.get('REDIS_URL'),
      // password: this.configService.get('REDIS_PASSWORD'),
    });

    this.client.on('error', (error) =>
      this.logger.fatal('Redis client connect error: ', error),
    );
    await this.client.connect();

    this.logger.log('Redis client connected');
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis client disconnected');
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(this.buildKey(key));
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    const fullKey = this.buildKey(key);

    if (ttl) {
      await this.client.setEx(fullKey, ttl, serialized);
    } else {
      await this.client.set(fullKey, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(this.buildKey(key));
  }

  async delPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(this.buildKey(pattern));
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  async clear(pattern?: string): Promise<void> {
    if (pattern) {
      await this.delPattern(pattern);
    } else {
      await this.client.flushDb();
    }
  }

  async getRaw(key: string): Promise<string | null> {
    return this.client.get(this.buildKey(key));
  }

  async setRaw(key: string, value: string, ttl?: number): Promise<void> {
    const fullKey = this.buildKey(key);
    if (ttl) {
      await this.client.setEx(fullKey, ttl, value);
    } else {
      await this.client.set(fullKey, value);
    }
  }
}
