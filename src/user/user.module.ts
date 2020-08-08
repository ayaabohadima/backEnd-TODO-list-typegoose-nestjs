import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "../models/user.schema";
import { Item } from "../models/item.schema";
@Module({
  imports: [TypegooseModule.forFeature([User]),
  TypegooseModule.forFeature([Item])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule { }
