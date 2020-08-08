import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "../models/user.schema";
import { SharedModule } from '../shared/shared.module'
import { UserBaseService } from './base-user.service';
import { ItemBaseService } from '../item/base-item.service';

@Module({
  imports: [SharedModule, SharedModule,
    TypegooseModule.forFeature([User])],
  providers: [UserService, UserBaseService, ItemBaseService],
  controllers: [UserController]
})
export class UserModule { }
