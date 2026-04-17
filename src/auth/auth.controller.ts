import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const result = await this.authService.register(dto);
        return result;
    }

    @Public()
    @Get('verify-email')
    async verifyEmail(@Query('token') token: string, @Res() res: Response) {
        const result = await this.authService.verifyEmail(token);

        const redirectUrl =
            `${process.env.FRONTEND_URL}/auth/callback` +
            `?accessToken=${encodeURIComponent(result.access_token)}` +
            `&refreshToken=${encodeURIComponent(result.refresh_token)}` +
            `&dashboard=${encodeURIComponent(result.dashboard)}` +
            `&user=${encodeURIComponent(JSON.stringify({
                id: result.user.id,
                email: result.user.email,
                role: result.user.role,
                status: result.user.status,
                full_name: result.user.full_name,
            }))}`;

        return res.redirect(redirectUrl);
    }

    @Public()
    @Post('login')
    async login(@Body() dto: LoginDto) {
        const result = await this.authService.login(dto);
        return result;
    }

    @Public()
    @Post('refresh')
    async refresh(@Body() dto: RefreshTokenDto) {
        const result = await this.authService.refresh(dto);
        return result;
    }

    @Post('logout')
    async logout(@Req() req: any) {
        const result = await this.authService.logout(req.user.sub);
        return result;
    }
    @Public()
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() { }

    @Public()
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthCallback(@Req() req: any, @Res() res: Response) {
        const result = await this.authService.googleLogin(req.user);

        const redirectUrl =
            `${process.env.FRONTEND_URL}/auth/callback` +
            `?accessToken=${encodeURIComponent(result.access_token)}` +
            `&refreshToken=${encodeURIComponent(result.refresh_token)}` +
            `&user=${encodeURIComponent(JSON.stringify({
                id: result.user.id,
                email: result.user.email,
                role: result.user.role,
                status: result.user.status,
                full_name: result.user.full_name,
            }))}`;

        return res.redirect(redirectUrl);
    }


}
