import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../core/config/config.service';
import { TokenRepository } from './token.repository';
import ms, { StringValue } from 'ms';
import { AuthenticatedUser } from '../dto/auth-user.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  generateAccessToken(actor: AuthenticatedUser): string {
    return this.createToken(
      actor,
      this.config.get('ACCESS_TOKEN_EXPIRED'),
      this.config.get('JWT_ACCESS_SECRET'),
    );
  }

  async generateRefreshToken(actor: AuthenticatedUser): Promise<string> {
    const duration = this.config.get('REFRESH_TOKEN_EXPIRED');

    const token = this.createToken(
      actor,
      duration,
      this.config.get('JWT_REFRESH_SECRET'),
    );

    const expiresAt = new Date(Date.now() + ms(duration as StringValue));

    await this.tokenRepository.saveRefreshTokenToDb(actor.id, token, expiresAt);

    return token;
  }

  private createToken(
    actor: AuthenticatedUser,
    expiresIn: string,
    secret: string,
  ) {
    const payload = { sub: actor.id, role: actor.role };

    // TODO: code duplicate move to time util
    const seconds = ms(expiresIn as StringValue) / 1000;

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: seconds,
    });
  }
}
