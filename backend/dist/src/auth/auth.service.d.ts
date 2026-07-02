import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from "../mail.service";
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly mailService;
    constructor(userService: UserService, jwtService: JwtService, mailService: MailService);
    register(authDto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    private getTokens;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        message: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
}
