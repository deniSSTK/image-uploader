import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterReqDto {
  @ApiProperty({
    example: 'test@email.com',
    description: 'User email address for registration',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'passw0rD',
    description:
      'User password (minimum 8 characters, must contain letters and numbers)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
