import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { UserStatus } from 'src/common/enums/user-status.enum';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { randomBytes } from 'crypto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            role: dto.role,
            full_name: dto.full_name,
        });

        const verificationToken = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

        await this.usersService.saveVerificationToken(
            user.id,
            verificationToken,
            expiresAt,
        );

        await this.mailService.sendVerificationEmail(user.email, verificationToken);

        return {
            message: 'User created. Verification email sent.',
        };
    }

    async verifyEmail(token: string) {

        const user = await this.usersService.activateUserByToken(token);

        if (!user) {
            throw new NotFoundException('Invalid verification token');
        }

        const accessToken = await this.generateAccessToken(user);

        const refreshToken = this.generateRefreshToken();
        const refreshExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

        await this.usersService.saveRefreshToken(
            user.id,
            refreshToken,
            refreshExpiresAt,
        );

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user,
        };
    }

    async generateAccessToken(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const tokenValue = await this.jwtService.signAsync(payload);

        return tokenValue;
    }

    generateRefreshToken() {
        return randomBytes(64).toString('hex');
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.password);

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.email_verified_at || user.status !== UserStatus.ACTIVE) {
            throw new UnauthorizedException('Email not verified');
        }

        const accessToken = await this.generateAccessToken(user);

        const refreshToken = this.generateRefreshToken();
        const refreshExpiresAt = new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 7,
        );

        await this.usersService.saveRefreshToken(
            user.id,
            refreshToken,
            refreshExpiresAt,
        );

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user,
        };
    }

    async refresh(dto: RefreshTokenDto) {
        const user = await this.usersService.validateRefreshToken(dto.refresh_token);

        const newAccessToken = await this.generateAccessToken(user);

        const newRefreshToken = this.generateRefreshToken();
        const newRefreshExpiresAt = new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 7,
        );

        await this.usersService.saveRefreshToken(
            user.id,
            newRefreshToken,
            newRefreshExpiresAt,
        );

        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        };
    }

    async logout(userId: string) {
        await this.usersService.removeRefreshToken(userId);

        return {
            message: 'Logout successful',
        };
    }
}
