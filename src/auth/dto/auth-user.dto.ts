import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUser {
  @ApiProperty()
  id: string;

  @ApiProperty()
  role: UserRole;
}
