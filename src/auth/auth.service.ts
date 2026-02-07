import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AccountReqDto } from './dto/request/account-req.dto';
import * as bcrypt from 'bcrypt';
import { AuthenticatedUser } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(private readonly authRepository: AuthRepository) {}

  async register(dto: AccountReqDto) {
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

  async login(dto: AccountReqDto): Promise<AuthenticatedUser> {
    this.logger.log('Attempt to login user', { email: dto.email });

    const passwordHash = await this.authRepository.getPasswordByEmail(
      dto.email,
    );

    if (!passwordHash) {
      this.logger.warn('Password not found', { email: dto.email });
      throw new ConflictException('User does not exist');
    }

    const match = await bcrypt.compare(passwordHash, dto.password);
    if (!match) {
      this.logger.warn('Password incorrect', { email: dto.email });
      throw new UnauthorizedException('Password incorrect');
    }

    const user = await this.authRepository.getAuthUserByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('User data not found');
    }

    this.logger.log('User login successfully ', { userId: user.id });
    return user;
  }
}
