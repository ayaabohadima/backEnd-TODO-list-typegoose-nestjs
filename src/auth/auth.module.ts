import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "../models/user.schema";
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypegooseModule.forFeature([User])],
  providers: [AuthService, JwtStrategy, UserService],
  controllers: [AuthController]
})
export class AuthModule { }

