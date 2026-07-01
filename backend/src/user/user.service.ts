import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: RegisterDto, passwordHash: string) {
    // 1. Déstructuration propre du DTO au début
    const { email, firstName, lastName } = dto;

    // 2. Vérification de l'existence
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Cet e-mail est déjà utilisé.');
    }

    // 3. Insertion propre en base de données grâce aux variables déstructurées
    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
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
}