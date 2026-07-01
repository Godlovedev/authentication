import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from "../prisma.service";
export type Payload = {
    id: string;
    email: string;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: Payload): Promise<{
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
    }>;
}
export {};
