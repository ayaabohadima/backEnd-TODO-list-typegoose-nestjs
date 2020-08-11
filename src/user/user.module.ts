import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user-repository.service';
import { UserController } from './user.controller';
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "../models/user.schema";
import { SharedModule } from '../shared/shared.module'
import { Item } from "../models/item.schema";
@Module({
  imports: [SharedModule, SharedModule,
    TypegooseModule.forFeature([User]),
    TypegooseModule.forFeature([Item])],
  providers: [UserService, UserRepository],
  controllers: [UserController]
})
export class UserModule { }
