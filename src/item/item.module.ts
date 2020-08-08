
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { User } from "../models/user.schema";
import { Item } from "../models/item.schema";
import { TypegooseModule } from "nestjs-typegoose";
import { SharedModule } from '../shared/shared.module'
@Module({
    imports: [SharedModule],
    providers: [ItemService],
    controllers: [ItemController]
})
export class ItemModule { }

