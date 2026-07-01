import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      // 🔑 Extraction du token directement depuis le cookie HTTP-Only
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['refresh_token'];
        }
        return token;
      },
      secretOrKey: configService.get('JWT_SECRET') as string,
      passReqToCallback: true, // Crucial pour récupérer le token en clair ci-dessous
    });
  }

  /**
   * Cette méthode valide le contenu du token une fois que Passport a vérifié sa signature
   */
  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token manquant ou invalide.');
    }

    // On renvoie les infos décodées ET le refresh token brut.
    // NestJS va mettre cet objet dans "req.user"
    return {
      id: payload.sub,
      email: payload.email,
      refreshToken,
    };
  }
}