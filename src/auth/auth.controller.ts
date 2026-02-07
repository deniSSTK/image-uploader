import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountReqDto } from './dto/request/account-req.dto';
import { TokenService } from './token/token.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TokensResDto } from './dto/response/tokens-res.dto';

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
    type: TokensResDto,
    description: 'User successfully registered',
  })
  async register(@Body() dto: AccountReqDto) {
    const user = await this.authService.register(dto);

    return this.tokenService.generateBothTokens(user, dto.deviceId);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TokensResDto,
    description: 'User successfully logged in',
  })
  @ApiOperation({ summary: 'Login for a user' })
  async login(@Body() dto: AccountReqDto) {
    const user = await this.authService.login(dto);

    return this.tokenService.generateBothTokens(user, dto.deviceId);
  }
}
