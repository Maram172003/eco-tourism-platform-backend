import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    async sendVerificationEmail(email: string, token: string) {
        const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

        await this.transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.SMTP_USER,
            to: email,
            subject: 'Vérifiez votre adresse email',
            html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Bienvenue sur Eco Voyage</h2>
          <p>Merci pour votre inscription.</p>
          <p>Cliquez sur le bouton ci-dessous pour vérifier votre email :</p>
          <p>
            <a href="${verifyUrl}" style="display:inline-block;padding:12px 20px;background:#22c55e;color:#000;text-decoration:none;border-radius:8px;font-weight:bold;">
              Vérifier mon email
            </a>
          </p>
          <p>Ce lien expirera dans 24 heures.</p>
        </div>
      `,
        });
    }
}
