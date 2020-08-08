import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Item } from "../models/item.schema";
import { User } from "../models/user.schema";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import * as Joi from '@hapi/joi';
import { UserService } from '../user/user.service';
@Injectable()
export class ItemService {
    constructor(
        @InjectModel(Item) private readonly itemModel: ReturnModelType<typeof Item>,
        @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
        private UserService: UserService,
    ) { }
    async getItemByID(id): Promise<Item | null> {
        const item = await this.itemModel.findOne({ _id: id });
        if (!item)
            new HttpException('not item', HttpStatus.BAD_REQUEST);
        return item;
    }

    async checkCeateItemData(createItemDto: {
        name: string;
        description?: string;
        toDoDate: Date;
        ifDone: boolean;
    }): Promise<Boolean> {
        const shcema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().optional(),
            ifDone: Joi.Boolean().optional(),
            toDoDate: Joi.date().raw().required(),
        });
        const validate = shcema.validate(createItemDto);
        if (validate.error)
            throw new HttpException(validate.error, HttpStatus.FORBIDDEN);
        return true;
    }
    async create(createItemDto: {
        name: string;
        description?: string;
        toDoDate: Date;
        ifDone: boolean;
    }, userID) {
        const user = await this.UserService.getUserByID(userID);
        if (!user)
            new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);

        await this.checkCeateItemData(createItemDto);
        const createdItem = new this.itemModel(createItemDto);
        await createdItem.save();
        await this.UserService.addItemToUser(createdItem._id, userID);
        return createdItem;
    }


}
