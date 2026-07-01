import { RegisterDto } from "../auth/dto/register.dto";
import { PrismaService } from "../prisma.service";
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: RegisterDto, passwordHash: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        createdAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        passwordHash: string;
        hashedRefreshToken: string | null;
        isEmailVerified: boolean;
        isActive: boolean;
        twoFactorSecret: string | null;
        isTwoFactorEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        hashedRefreshToken: string | null;
        isEmailVerified: boolean;
        isActive: boolean;
        twoFactorSecret: string | null;
        isTwoFactorEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
}
