import { Injectable, InternalServerErrorException } from '@nestjs/common';

interface Config {
  DATABASE_URL: string;
  REDIS_URL: string;
  REDIS_APP_KEY: string;
  ACCESS_TOKEN_EXPIRED: string;
  REFRESH_TOKEN_EXPIRED: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: Config;

  constructor() {
    //TODO: add default values for non required fields
    const requiredKeys: (keyof Config)[] = [
      'DATABASE_URL',
      'REDIS_URL',
      'REDIS_APP_KEY',
      'ACCESS_TOKEN_EXPIRED',
      'REFRESH_TOKEN_EXPIRED',
      'JWT_ACCESS_SECRET',
      'JWT_REFRESH_SECRET',
    ];

    const config = {} as Config;

    for (const key of requiredKeys) {
      const value = process.env[key];
      if (!value) {
        throw new InternalServerErrorException(`Config error: missing ${key}`);
      }
      config[key] = value;
    }

    this.envConfig = config;
  }

  get<T extends keyof Config>(key: T): Config[T] {
    return this.envConfig[key];
  }
}
