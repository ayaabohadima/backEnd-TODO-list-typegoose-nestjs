import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "../models/user.schema";
import { JwtStrategy } from './jwt.strategy';
import { SharedModule } from '../shared/shared.module'
@Module({
  imports: [SharedModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }

