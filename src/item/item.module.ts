
import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ItemService } from './item.service';
import { ItemRepository } from './item-repository.service';
import { ItemController } from './item.controller';
import { User } from "../models/user.schema";
import { Item } from "../models/item.schema";
import { TypegooseModule } from "nestjs-typegoose";
import { SharedModule } from '../shared/shared.module';
import { UserRepository } from '../user/user-repository.service';


@Module({
    imports: [
        SharedModule,
        TypegooseModule.forFeature([Item]),
        TypegooseModule.forFeature([User])
    ],
    providers: [
        ItemService,
        UserService,
        UserRepository,
        ItemRepository
    ],
    controllers: [ItemController]
})
export class ItemModule { }

