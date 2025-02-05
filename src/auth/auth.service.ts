import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}

@Injectable()
export class AuthService {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.join(process.cwd(), 'db.json');
    }

    private async readUsers(): Promise<User[]> {
        try {
            const data = await fs.readFile(this.dbPath, 'utf8');
            return JSON.parse(data).users || [];
        } catch {
            return [];
        }
    }

    private async writeUsers(users: User[]) {
        await fs.writeFile(this.dbPath, JSON.stringify({ users }, null, 2));
    }

    async signUp(userData: { username: string; email: string; password: string }) {
        const users = await this.readUsers();

        const existingUser = users.find(
            user => user.username === userData.username || user.email === userData.email
        );

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const newUser = {
            id: uuidv4(),
            ...userData
        };

        users.push(newUser);
        await this.writeUsers(users);

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async login(credentials: { username: string; password: string }) {
        const users = await this.readUsers();

        const user = users.find(
            user => (user.username === credentials.username || user.email === credentials.username)
                && user.password === credentials.password
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
    }
}