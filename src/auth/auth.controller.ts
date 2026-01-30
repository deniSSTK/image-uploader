import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterReqDto } from './dto/request/register-req.dto';
import { TokenService } from './token/token.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterResDto } from './dto/response/register-res.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account and returns access and refresh tokens',
  })
  @ApiCreatedResponse({
    type: RegisterResDto,
    description: 'User successfully registered',
  })
  async register(@Body() dto: RegisterReqDto) {
    const user = await this.authService.register(dto);

    return {
      accessToken: this.tokenService.generateAccessToken(user),
      refreshToken: await this.tokenService.generateRefreshToken(user),
    };
  }
}
