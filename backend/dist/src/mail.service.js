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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let MailService = class MailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }
    async sendVerificationEmail(targetEmail, token) {
        const url = `http://localhost:3000/auth/verify-email?token=${token}`;
        await this.transporter.sendMail({
            from: `"Authentication Lab" <${process.env.MAIL_USER}>`,
            to: targetEmail,
            subject: '🧪 Active ton compte - Authentication Lab',
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; padding: 40px 10px; color: #333333;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <div style="background-color: #1e293b; padding: 30px; text-align: center;">
              <h1 style="color: #38bdf8; margin: 0; font-size: 24px; letter-spacing: 0.5px;">Authentication Lab</h1>
              <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">Le laboratoire de sécurité</p>
            </div>

            <div style="padding: 40px 30px; line-height: 1.6;">
              <h2 style="margin-top: 0; color: #0f172a; font-size: 20px;">Bienvenue à bord !</h2>
              <p style="color: #475569; font-size: 15px;">Merci de t'être inscrit sur la plateforme. Avant de pouvoir te connecter et commencer à tester le boilerplate, tu dois valider ton adresse e-mail.</p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${url}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 30px; font-weight: 600; text-decoration: none; border-radius: 8px; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);">
                  Vérifier mon adresse e-mail
                </a>
              </div>

              <p style="color: #64748b; font-size: 13px; margin-bottom: 0;">Ce lien de sécurité est temporaire et expirera automatiquement dans 24 heures.</p>
            </div>

            <div style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
              <p style="margin: 0;">Ceci est un e-mail automatique généré par ton projet local.</p>
              <p style="margin: 5px 0 0 0; font-family: monospace; color: #cbd5e1;">URL: ${url}</p>
            </div>

          </div>
        </div>
      `,
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map