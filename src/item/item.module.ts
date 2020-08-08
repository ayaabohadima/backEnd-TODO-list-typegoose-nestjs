
import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "../models/user.schema";
import { Item } from "../models/item.schema";


@Module({
    imports: [TypegooseModule.forFeature([User]), TypegooseModule.forFeature([Item])],
    providers: [UserService, ItemService],
    controllers: [ItemController]
})
export class ItemModule { }

