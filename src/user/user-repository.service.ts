import { User } from "../models/user.schema";
import { ReturnModelType } from "@typegoose/typegoose";
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { ModelType } from 'typegoose';
import { InjectModel } from "nestjs-typegoose";
import { BaseRepository } from "../shared/repository/base.service";
import { promises } from "dns";
const ObjectId = require('mongoose').Types.ObjectId;

@Injectable()
export class UserRepository extends BaseRepository<User>  {
    constructor(
        @InjectModel(User) private readonly _userModel: ModelType<User>
    ) {
        super();
        this._Model = _userModel;
    }

    async findByEmail(email: string) {
        return await this.findOne({ email: email });
    }

    async updateUserItem(userID, items) {
        if (!ObjectId.isValid(userID)) throw new HttpException('Invalid object id', HttpStatus.FORBIDDEN);
        return await this.update(userID, { items: items });
    }

    async addItemToUser(userID, itemID) {
        const user = await this.findByID(userID);
        let items = user.items;
        items.push(itemID);
        return await this.updateUserItem(userID, items);
    }

    async createUser(userData: RegisterDto) {
        return await this.create(userData);
    }
    async checkUserHaveItem(userID, itemID): Promise<Boolean> {
        const user = await this.findByID(userID);
        for (let i = 0; i < user.items.length; i++)
            if (String(user.items[i]) == String(itemID))
                return true;
        return false;
    }

    async getUserItems(userID): Promise<Array<any>> {
        const user = await this.findByID(userID);
        return user.items;
    }

    async deleteUserItem(userID, itemID): Promise<Boolean> {
        const user = await this.findByID(userID);
        for (let i = 0; i < user.items.length; i++)
            if (String(user.items[i]) == String(itemID)) {
                user.items.splice(i, 1);
                await this.update(userID, { items: user.items });
                return true;
            }
        return false;

    }



}