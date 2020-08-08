import { Controller, Get, Post, Body, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { JwtStrategy } from './jwt.strategy';
import { User } from "../models/user.schema";
import { AuthGuard } from '@nestjs/passport';

@Controller('')
export class AuthController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) { }

    @Post('/sign-up')
    async create(@Body() user: User) {
        const createdUser = await this.userService.create(user);

        if (!createdUser) throw new Error('user not found');
        const token = await this.authService.signPayload({ _id: createdUser._id });
        return { token };
    }

    @Post('/login')
    async login(@Body() loginDto: { email, password }) {
        const user = await this.userService.findByLogin(loginDto);
        if (!user) throw new Error('user not found');
        const token = await this.authService.signPayload({ _id: user._id, });
        return { token };
    }

    // should takeToken not body param
    @UseGuards(AuthGuard('jwt'))
    @Delete('/me/delete')
    async delete(@Request() req) {
        return await this.userService.deleteUser(req.user._id);
    }

}