import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        emailVerificationHash: data.emailVerificationHash,
        emailVerificationExpiresAt: data.emailVerificationExpiresAt,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("L'utilisateur n'existe pas.");
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    let hashedRefreshToken: string | null = null;
    
    // Si on passe un token, on le hache avant de le stocker
    if (refreshToken) {
      hashedRefreshToken = await argon2.hash(refreshToken);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  /**
   * Trouve un utilisateur grâce au hash de son token de vérification
   */
  async findByVerificationHash(hash: string) {
    return await this.prisma.user.findFirst({
      where: { emailVerificationHash: hash },
    });
  }

  /**
   * Valide l'e-mail de l'utilisateur et nettoie les jetons en BDD
   */
  async verifyUserEmail(userId: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        emailVerificationHash: null, // On vide le token pour qu'il ne soit plus réutilisable
        emailVerificationExpiresAt: null,
      },
    });
  }

}