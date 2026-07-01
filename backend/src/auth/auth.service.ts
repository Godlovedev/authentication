import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  /**
   * Logique globale d'inscription d'un utilisateur
   */
  async register(dto: RegisterDto) {
    // 1. Hachage du mot de passe sécurisé avec Argon2
    const hashedPassword = await argon2.hash(dto.password);

    // 2. Délégation de la création au UserService
    const newUser = await this.userService.create(dto, hashedPassword);

    // 3. Retour d'une réponse propre pour le client (le mot de passe n'y est pas grâce au 'select')
    return {
      message: 'Utilisateur enregistré avec succès.',
      user: newUser,
    };
  };

  private async getTokens(userId: string, email: string) {
    // Le payload contient les infos de base que l'on veut retrouver plus tard
    const payload = { sub: userId, email };

    // Fabrication du token d'accès (valide 15 minutes)
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    // Fabrication du token de rafraîchissement (valide 7 jours)
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    // On renvoie les deux tokens fabriqués
    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. On cherche l'utilisateur et on valide son mot de passe
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    // 2. On fabrique la paire de jetons (Access et Refresh)
    const tokens = await this.getTokens(user.id, user.email);

    // 3. On sauvegarde le Refresh Token (haché) dans notre registre en base de données
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    // 4. On renvoie un message de succès et les deux tokens au client
    return {
      message: 'Connexion réussie.',
      ...tokens,
    };
  }
}