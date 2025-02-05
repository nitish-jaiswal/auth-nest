import { Body, Controller, Post } from '@nestjs/common';
import { CreateUser, LoginDto } from '../auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signUp(@Body() createUser: CreateUser) {
        return await this.authService.signUp(createUser);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }
}