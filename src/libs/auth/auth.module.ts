import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UtilsModule } from '@libs/utils/utils.module';
import { UsersModule } from '@modules/users/users.module';
import { JwtStrategy } from './strategies/at.strategy';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' },
    }),
    UtilsModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
