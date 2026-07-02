import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail.service';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly mailService: MailService) {}

  /**
   * Logique globale d'inscription d'un utilisateur
   */
  async register(authDto: RegisterDto) {
    const userExists = await this.userService.findByEmail(authDto.email);
    if (userExists) {
      throw new BadRequestException('Cet e-mail est déjà utilisé.');
    }

    // 1. Le mot de passe : Sécurisé par Argon2 (Lent et robuste)
    const passwordHash = await argon2.hash(authDto.password);

    // 2. Le Token d'e-mail : Un UUID en clair pour le client
    const verificationTokenInPlain = uuidv4();
    
    // 3. Le stockage : Sécurisé par SHA-256 (Ultra rapide, protège la BDD sans détruire les performances)
    const emailVerificationHash = createHash('sha256')
      .update(verificationTokenInPlain)
      .digest('hex');

    const emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 4. Enregistrement via le UserService
    const newUser = await this.userService.create({
      email: authDto.email,
      passwordHash,
      firstName: authDto.firstName,
      lastName: authDto.lastName,
      emailVerificationHash,
      emailVerificationExpiresAt,
    });

    // 5. Envoi du mail
    await this.mailService.sendVerificationEmail(newUser.email, verificationTokenInPlain);

    return {
      message: 'Inscription réussie ! Un e-mail de validation vous a été envoyé.',
      userId: newUser.id,
    };
  }

  private async getTokens(userId: string, email: string) {
    // Le payload contient les infos de base que l'on veut retrouver plus tard
    const payload = { id: userId, email };

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
  };

  async refreshTokens(userId: string, refreshToken: string) {
    // 1. On récupère l'utilisateur en BDD pour aller voir son registre
    const user = await this.userService.findById(userId); // Assure-toi d'avoir findById dans ton UserService
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Accès refusé. Session inexistante.');
    }

    // 2. On compare le token reçu avec le hash stocké en base de données
    const refreshTokenMatches = await argon2.verify(user.hashedRefreshToken, refreshToken);
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Accès refusé. Token invalide.');
    }

    // 3. Si tout est bon, on fabrique une nouvelle paire de tokens
    const tokens = await this.getTokens(user.id, user.email);

    // 4. On met à jour le registre avec le nouveau Refresh Token
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    // 5. On renvoie les nouveaux tokens
    return tokens;
  };


  async logout(userId: string) {
    // On passe le hash à null dans la base de données
    await this.userService.updateRefreshToken(userId, null);
    return { message: 'Déconnexion réussie.' };
  }

  async verifyEmail(token: string) {
    // 1. On hache le token reçu en clair pour pouvoir le comparer à la BDD
    const hash = createHash('sha256').update(token).digest('hex');

    // 2. On cherche l'utilisateur via le UserService
    const user = await this.userService.findByVerificationHash(hash);

    // 3. Si aucun utilisateur n'a ce token, il est invalide
    if (!user) {
      throw new BadRequestException('Token de vérification invalide.');
    }

    // 4. On vérifie si le token n'a pas expiré (limite des 24h)
    if (!user.emailVerificationExpiresAt || new Date() > user.emailVerificationExpiresAt) {
      throw new BadRequestException('Le token de vérification a expiré.');
    }

    // 5. On valide l'utilisateur en BDD via le UserService
    await this.userService.verifyUserEmail(user.id);

    return { message: 'Votre adresse e-mail a été vérifiée avec succès ! Vous pouvez maintenant vous connecter.' };
  }
}