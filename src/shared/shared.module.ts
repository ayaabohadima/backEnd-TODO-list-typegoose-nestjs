import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User } from "../models/user.schema";
import { Item } from "../models/item.schema";
import { TypegooseModule } from "nestjs-typegoose";
@Module({
    imports: [
        TypegooseModule.forFeature([Item]),
        TypegooseModule.forFeature([User]),],
    providers: [UserService]
})
export class SharedModule { }
