
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { User } from "../models/user.schema";
import { Item } from "../models/item.schema";
import { TypegooseModule } from "nestjs-typegoose";
@Module({
    imports: [
        TypegooseModule.forFeature([Item]),
        TypegooseModule.forFeature([User]),
        UserModule],
    providers: [UserService, ItemService],
    controllers: [ItemController]
})
export class ItemModule { }

