import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { RegisterReqDto } from './dto/request/register-req.dto';
import { AuthenticatedUser } from './dto/auth-user.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async IsEmailExists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });

    return count > 0;
  }

  async createUser(dto: RegisterReqDto): Promise<AuthenticatedUser> {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: dto.password,
      },
      select: {
        id: true,
        role: true,
      },
    });
  }
}
