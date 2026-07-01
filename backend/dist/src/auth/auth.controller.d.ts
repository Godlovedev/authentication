import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as Express from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            email: string;
            firstName: string | null;
            lastName: string | null;
            id: string;
            createdAt: Date;
        };
    }>;
    login(loginDto: LoginDto, res: Express.Response): Promise<{
        message: string;
        access_token: string;
    }>;
    refresh(req: any, res: Express.Response): Promise<{
        access_token: string;
    }>;
}
