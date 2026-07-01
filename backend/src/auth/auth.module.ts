import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma.service';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
    imports: [
        JwtModule.registerAsync({
        global: true,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: { 
            expiresIn: '15m'
          },
        }),
      }),
      UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, PrismaService, JwtRefreshStrategy]
})
export class AuthModule {}
