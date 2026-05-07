import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthMethod } from '../common/enums/auth-method.enum';
import { UserStatus } from '../common/enums/user-status.enum';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) { }

    async create(dto: CreateUserDto) {
        const user = this.repo.create({
            email: dto.email,
            password: dto.password,
            role: dto.role,
            full_name: dto.full_name,
            auth_method: AuthMethod.EMAIL,
            status: UserStatus.PENDING,
            email_verified_at: null,
        });

        const savedUser = await this.repo.save(user);

        return savedUser;
    }

    async findByEmail(email: string) {
        const user = await this.repo.findOne({
            where: { email },
        });

        return user;
    }

    async findById(id: string) {
        const user = await this.repo.findOne({
            where: { id },
        });

        return user;
    }

    async activateUser(id: string) {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.status = UserStatus.ACTIVE;
        user.email_verified_at = new Date();

        const updatedUser = await this.repo.save(user);

        return updatedUser;
    }

    async saveVerificationToken(userId: string, token: string, expiresAt: Date) {
        const user = await this.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.verification_token = token;
        user.verification_token_expires_at = expiresAt;

        const updatedUser = await this.repo.save(user);

        return updatedUser;
    }
    async findByVerificationToken(token: string) {
        const user = await this.repo.findOne({
            where: { verification_token: token },
        });

        return user;
    }
    async activateUserByToken(token: string) {
        const user = await this.findByVerificationToken(token);

        if (!user) {
            throw new NotFoundException('Invalid verification token');
        }

        if (!user.verification_token_expires_at) {
            throw new UnauthorizedException('Verification token expiry missing');
        }

        if (user.verification_token_expires_at.getTime() < Date.now()) {
            throw new UnauthorizedException('Verification token expired');
        }

        user.status = UserStatus.ACTIVE;
        user.email_verified_at = new Date();
        user.verification_token = null;
        user.verification_token_expires_at = null;

        const updatedUser = await this.repo.save(user);

        return updatedUser;
    }

    async saveRefreshToken(userId: string, refreshToken: string, expiresAt: Date) {
        const user = await this.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.refresh_token = refreshToken;
        user.refresh_token_expires_at = expiresAt;

        const updatedUser = await this.repo.save(user);

        return updatedUser;
    }

    async findByRefreshToken(refreshToken: string) {
        const user = await this.repo.findOne({
            where: { refresh_token: refreshToken },
        });

        return user;
    }

    async validateRefreshToken(refreshToken: string) {
        const user = await this.findByRefreshToken(refreshToken);

        if (!user) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (!user.refresh_token_expires_at) {
            throw new UnauthorizedException('Refresh token expiry missing');
        }

        if (user.refresh_token_expires_at.getTime() < Date.now()) {
            throw new UnauthorizedException('Refresh token expired');
        }

        return user;
    }
    async saveResetToken(userId: string, token: string, expiresAt: Date) {
        const user = await this.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        user.reset_password_token = token;
        user.reset_password_token_expires_at = expiresAt;
        return await this.repo.save(user);
    }

    async findByResetToken(token: string) {
        return await this.repo.findOne({ where: { reset_password_token: token } });
    }

    async updatePassword(userId: string, hashedPassword: string) {
        const user = await this.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        user.password = hashedPassword;
        user.reset_password_token = null;
        user.reset_password_token_expires_at = null;
        return await this.repo.save(user);
    }

    async removeRefreshToken(userId: string) {
        const user = await this.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.refresh_token = null;
        user.refresh_token_expires_at = null;

        const updatedUser = await this.repo.save(user);

        return updatedUser;
    }

}
