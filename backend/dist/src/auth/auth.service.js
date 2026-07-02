"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const uuid_1 = require("uuid");
const argon2 = __importStar(require("argon2"));
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../mail.service");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    userService;
    jwtService;
    mailService;
    constructor(userService, jwtService, mailService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(authDto) {
        const userExists = await this.userService.findByEmail(authDto.email);
        if (userExists) {
            throw new common_1.BadRequestException('Cet e-mail est déjà utilisé.');
        }
        const passwordHash = await argon2.hash(authDto.password);
        const verificationTokenInPlain = (0, uuid_1.v4)();
        const emailVerificationHash = (0, crypto_1.createHash)('sha256')
            .update(verificationTokenInPlain)
            .digest('hex');
        const emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const newUser = await this.userService.create({
            email: authDto.email,
            passwordHash,
            firstName: authDto.firstName,
            lastName: authDto.lastName,
            emailVerificationHash,
            emailVerificationExpiresAt,
        });
        await this.mailService.sendVerificationEmail(newUser.email, verificationTokenInPlain);
        return {
            message: 'Inscription réussie ! Un e-mail de validation vous a été envoyé.',
            userId: newUser.id,
        };
    }
    async getTokens(userId, email) {
        const payload = { id: userId, email };
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });
        return { accessToken, refreshToken };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Identifiants incorrects.');
        }
        const isPasswordValid = await argon2.verify(user.passwordHash, password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Identifiants incorrects.');
        }
        const tokens = await this.getTokens(user.id, user.email);
        await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
        return {
            message: 'Connexion réussie.',
            ...tokens,
        };
    }
    ;
    async refreshTokens(userId, refreshToken) {
        const user = await this.userService.findById(userId);
        if (!user || !user.hashedRefreshToken) {
            throw new common_1.ForbiddenException('Accès refusé. Session inexistante.');
        }
        const refreshTokenMatches = await argon2.verify(user.hashedRefreshToken, refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.ForbiddenException('Accès refusé. Token invalide.');
        }
        const tokens = await this.getTokens(user.id, user.email);
        await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    ;
    async logout(userId) {
        await this.userService.updateRefreshToken(userId, null);
        return { message: 'Déconnexion réussie.' };
    }
    async verifyEmail(token) {
        const hash = (0, crypto_1.createHash)('sha256').update(token).digest('hex');
        const user = await this.userService.findByVerificationHash(hash);
        if (!user) {
            throw new common_1.BadRequestException('Token de vérification invalide.');
        }
        if (!user.emailVerificationExpiresAt || new Date() > user.emailVerificationExpiresAt) {
            throw new common_1.BadRequestException('Le token de vérification a expiré.');
        }
        await this.userService.verifyUserEmail(user.id);
        return { message: 'Votre adresse e-mail a été vérifiée avec succès ! Vous pouvez maintenant vous connecter.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService, jwt_1.JwtService, mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map