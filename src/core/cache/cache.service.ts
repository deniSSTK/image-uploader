import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class CacheService {
  protected prefix: string = '';

  abstract get<T>(key: string): Promise<T | null>;
  abstract set<T>(key: string, value: T, ttl?: number): Promise<void>;
  abstract del(key: string): Promise<void>;
  abstract clear(): Promise<void>;
  abstract delPattern(pattern: string): Promise<void>;

  protected buildKey(key: string): string {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }
}
