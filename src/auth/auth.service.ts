import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterReqDto } from './dto/request/register-req.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(private readonly authRepository: AuthRepository) {}

  async register(dto: RegisterReqDto) {
    this.logger.log('Register new user account', { email: dto.email });

    const emailExists = await this.authRepository.IsEmailExists(dto.email);
    if (emailExists) {
      this.logger.warn(`Email already exists for ${dto.email}`);
      throw new ConflictException('Email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.authRepository.createUser({
      ...dto,
      password: hashedPassword,
    });

    this.logger.log('Account registered successfully', {
      email: dto.email,
      userId: user.id,
    });

    return user;
  }
}
