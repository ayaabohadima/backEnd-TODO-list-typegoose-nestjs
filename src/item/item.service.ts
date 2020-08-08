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
        //@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
        private UserService: UserService,
    ) { }
    async getItemByID(id): Promise<Item | null> {

        const item = await this.itemModel.findOne({ _id: id });
        if (!item)
            new HttpException('not item', HttpStatus.BAD_REQUEST);
        return item;
    }

    async getUserItem(userID, itemID) {
        if (!await this.UserService.checkUserHaveItem(userID, itemID))
            new HttpException('you do not have this item ', HttpStatus.UNAUTHORIZED);
        return this.getItemByID(itemID);
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
    async checkUpdateItemData(updateItemDto: {
        name?: string;
        description?: string;
        toDoDate?: Date;
    }): Promise<Boolean> {
        const shcema = Joi.object({
            name: Joi.string().optional(),
            description: Joi.string().optional(),
            toDoDate: Joi.date().raw().optional(),
        });
        const validate = shcema.validate(updateItemDto);
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
    async toggleIsDone(userID, itemID) {
        if (!await this.UserService.checkUserHaveItem(userID, itemID))
            new HttpException('you do not have this item ', HttpStatus.UNAUTHORIZED);
        const item = await this.getItemByID(itemID);
        await this.itemModel.updateOne({ _id: itemID }, { ifDone: item.ifDone ? false : true });
        return item.ifDone ? false : true;
    }
    async updateItem(userID, itemID, updateItemDto: {
        name?: string;
        description?: string;
        toDoDate?: Date;
    }) {
        if (!await this.UserService.checkUserHaveItem(userID, itemID))
            new HttpException('you do not have this item ', HttpStatus.UNAUTHORIZED);
        const item = await this.getItemByID(itemID);
        await this.checkUpdateItemData(updateItemDto);
        if (updateItemDto.description)
            await this.itemModel.updateOne({ _id: itemID }, { description: updateItemDto.description });
        if (updateItemDto.name)
            await this.itemModel.updateOne({ _id: itemID }, { name: updateItemDto.name });
        if (updateItemDto.toDoDate)
            await this.itemModel.updateOne({ _id: itemID }, { toDoDate: updateItemDto.toDoDate });
    }

    async getUserAllItems(userId) {
        const itemsIDs = await this.UserService.getUserItem(userId);
        var items = [];
        for (let i = 0; i < itemsIDs.length; i++) {
            const item = await this.getItemByID(itemsIDs[i]);
            items.push(item);
        }
        return items;
    }
    async getUserUnDoItems(userId) {
        const itemsIDs = await this.UserService.getUserItem(userId);
        var items = [];
        for (let i = 0; i < itemsIDs.length; i++) {
            const item = await this.getItemByID(itemsIDs[i]);
            if (!item.ifDone)
                items.push(item);
        }
        return items;
    }

    async getUserDoneItems(userId) {
        const itemsIDs = await this.UserService.getUserItem(userId);
        var items = [];
        for (let i = 0; i < itemsIDs.length; i++) {
            const item = await this.getItemByID(itemsIDs[i]);
            if (item.ifDone)
                items.push(item);
        }
        return items;
    }

    async getUserItemsForThisDay(userId) {
        const itemsIDs = await this.UserService.getUserItem(userId);
        var items = [];
        const today = new Date();
        // const dateNow = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        for (let i = 0; i < itemsIDs.length; i++) {
            var item = await this.getItemByID(itemsIDs[i]);
            if (item.toDoDate == today)
                items.push(item);
        }
        return items;
    }

    async getUserItemsForThisDayUndo(userId) {
        const itemsIDs = await this.UserService.getUserItem(userId);
        var items = [];
        const today = new Date();
        for (let i = 0; i < itemsIDs.length; i++) {
            const item = await this.getItemByID(itemsIDs[i]);
            if (!item.ifDone && item.toDoDate == today)
                items.push(item);
        }
        return items;
    }

    async deleteItem(itemID, userID) {
        if (!await this.UserService.checkUserHaveItem(userID, itemID))
            new HttpException('you do not have this item ', HttpStatus.UNAUTHORIZED);
        if (await this.UserService.deleteItemFromUser(userID, itemID))
            await this.itemModel.findOneAndDelete({ _id: itemID });
    }

}
