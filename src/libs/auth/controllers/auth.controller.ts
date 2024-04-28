import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignUpDto, UserLoginDto } from '../dtos/common';
import { AtGuard } from '../guards/at.guard';
import { Public } from 'src/libs/decorators';
import { AuthService } from '../services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* 
  This method handles POST /auth/register requests. It's decorated with @Public(), meaning it can be accessed without authentication. It takes a SignUpDto object from the request body, passes it to AuthService.register(), and returns the resulting access token.
  */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signUpDto: SignUpDto) {
    const token = await this.authService.register(signUpDto);
    return { access_token: token.access_token };
  }

  /* 
  This method handles POST /auth/login requests. Like register, it's also public. It takes a UserLoginDto object from the request body, passes it to AuthService.logIn(), and returns the resulting access token.
  */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async logIn(@Body() userLogInDto: UserLoginDto) {
    const token = await this.authService.logIn(userLogInDto);

    return { access_token: token.access_token };
  }

  /* 
  This method handles POST /auth/check requests. It's decorated with @UseGuards(AtGuard), meaning it requires authentication. It doesn't take any input and simply returns true. This could be used to check if the client's access token is valid.
  */
  @Post('check')
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async check() {
    return true;
  }
}
