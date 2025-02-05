import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}

@Injectable()
export class AuthService {
    private readonly jsonServerUrl = 'http://localhost:3001/users';

    constructor(private readonly httpService: HttpService) { }

    async signUp(userData: { username: string; email: string; password: string }) {
        try {
            const { data: existingByUsername } = await firstValueFrom(
                this.httpService.get<User[]>(`${this.jsonServerUrl}?username=${userData.username}`)
            );

            const { data: existingByEmail } = await firstValueFrom(
                this.httpService.get<User[]>(`${this.jsonServerUrl}?email=${userData.email}`)
            );

            if (existingByUsername.length > 0 || existingByEmail.length > 0) {
                throw new BadRequestException('User already exists');
            }

            const newUser = {
                id: uuidv4(),
                ...userData
            };

            const { data } = await firstValueFrom(
                this.httpService.post<User>(this.jsonServerUrl, newUser)
            );

            const { password, ...userWithoutPassword } = data;
            return userWithoutPassword;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('SignUp error:', error.response?.data || error.message);
            }
            throw error;
        }
    }

    async login(credentials: { username: string; password: string }) {
        try {
            const { data: usersByUsername } = await firstValueFrom(
                this.httpService.get<User[]>(`${this.jsonServerUrl}?username=${credentials.username}`)
            );
            const { data: usersByEmail } = await firstValueFrom(
                this.httpService.get<User[]>(`${this.jsonServerUrl}?email=${credentials.username}`)
            );

            const users = [...usersByUsername, ...usersByEmail];
            const user = users.find(
                u => (u.username === credentials.username || u.email === credentials.username)
                    && u.password === credentials.password
            );

            if (!user) {
                throw new NotFoundException('Invalid credentials');
            }

            const { password, ...userWithoutPassword } = user;
            return {
                user: userWithoutPassword,
                success: true,
                message: 'Login successful'
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Login error:', error.response?.data || error.message);
            }
            throw error;
        }
    }
}