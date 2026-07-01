import { Body, Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as Express from 'express';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Express.Response) {
    // 1. On appelle le service qui fait les vérifications et génère les deux tokens
    const { accessToken, refreshToken, message } = await this.authService.login(loginDto);
    // 2. On enferme le Refresh Token dans un cookie HTTP-Only ultra-sécurisé
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,                 // 🔒 Interdit l'accès au token via JavaScript (Protection XSS)
      secure: process.env.NODE_ENV === 'production', // 🌐 Activé uniquement en HTTPS en production
      sameSite: 'lax',                // 🛡️ Protection contre les attaques CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // ⏳ Durée de vie du cookie identique au token (7 jours en millisecondes)
    });

    // 3. On ne renvoie au frontend que le message et l'Access Token (Le Refresh reste caché dans le cookie)
    return {
      message,
      access_token: accessToken,
    };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Request() req: any, // Ici, req.user contient l'objet renvoyé par le validate() de ta stratégie
    @Res({ passthrough: true }) res: Express.Response,
  ) {
    // 1. On extrait l'ID et le token en clair que notre stratégie a préparé dans req.user
    const userId = req.user.id;
    const refreshToken = req.user.refreshToken;

    // 2. On demande au service de vérifier en BDD et de générer les nouveaux tokens
    const tokens = await this.authService.refreshTokens(userId, refreshToken);

    // 3. On remplace l'ancien Refresh Token expiré par le tout nouveau dans le cookie
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // Valide 7 jours
    });

    // 4. On renvoie le nouvel Access Token tout neuf au frontend (dans le JSON)
    return {
      access_token: tokens.accessToken,
    };
  }
}