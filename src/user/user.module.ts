import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "../models/user.schema";
import { Item } from "../models/item.schema";
import { SharedModule } from '../shared/shared.module'
@Module({
  imports: [SharedModule],
  controllers: [UserController]
})
export class UserModule { }
