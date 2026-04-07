import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
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
    async verifyEmail(@Query('token') token: string) {
        const result = await this.authService.verifyEmail(token);
        return result;
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
}
