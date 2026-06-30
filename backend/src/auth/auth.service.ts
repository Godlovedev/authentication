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
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Rechercher l'utilisateur par son email
    const user = await this.userService.findByEmail(email);

    // Sécurité OWASP : Si l'utilisateur n'existe pas, on ne dit pas "Cet email n'existe pas"
    // On reste vague pour éviter l'énumération d'emails par un attaquant.
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    // 2. Vérifier si le mot de passe correspond au hash en base de données
    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    // 3. Préparer le contenu du Token (Payload)
    const { id, email: userEmail } = user;
    const payload: Payload = { id, email: userEmail };

    // 4. Générer le token et retourner la réponse
    return {
      message: 'Connexion réussie.',
      access_token: this.jwtService.sign(payload),
    };
  }
}