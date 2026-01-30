import { PrismaService } from '../../core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveRefreshTokenToDb(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }
}
