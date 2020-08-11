import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "../models/user.schema";
import { Item } from "../models/item.schema";
import { JwtStrategy } from './jwt.strategy';
import { SharedModule } from '../shared/shared.module';
import { Email } from './send-email.service';
import { ItemService } from 'src/item/item.service';
import { UserRepository } from '../user/user-repository.service';
import { ItemRepository } from '../item/item-repository.service';
@Module({
  imports: [SharedModule, SharedModule,
    TypegooseModule.forFeature([User]),
    TypegooseModule.forFeature([Item])
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    Email,
    ItemService,
    UserRepository,
    ItemRepository
  ],
  controllers: [AuthController]
})
export class AuthModule { }

