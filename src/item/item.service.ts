import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Item } from "../models/item.schema";
import { ItemRepository } from './item-repository.service';
const ObjectId = require('mongoose').Types.ObjectId;
import { UserService } from '../user/user.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";

@Injectable()
export class ItemService extends ItemRepository {

    constructor(
        @InjectModel(Item) private readonly _itemModel: ReturnModelType<typeof Item>,
        private UserService: UserService,
    ) {
        super();
        this.itemModel = _itemModel;

    }

    async getItemByID(id): Promise<Item | null> {
        if (!ObjectId.isValid(id)) throw new HttpException('not valid object id', HttpStatus.FORBIDDEN);
        const item = await this.findOne({ _id: id });
        if (!item) {
            throw new HttpException('no item ', HttpStatus.FORBIDDEN);
        }
        return item;
    }

    async getUserItem(userID, itemID) {
        if (!await this.UserService.checkUserHaveItem(userID, itemID))
            throw new HttpException('you do not have this item ', HttpStatus.UNAUTHORIZED);
        return this.getItemByID(itemID);
    }
    async createItem(createItemDto: CreateDto, userID) {
        const user = await this.UserService.getUserByID(userID);
        if (!user)
            throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
        const createdItem = await this.create(createItemDto);
        await this.UserService.addItemToUser(createdItem._id, userID);
        return createdItem;
    }
    async toggleIsDone(userID, itemID) {
        if (!await this.UserService.checkUserHaveItem(userID, itemID))
            throw new HttpException('you do not have this item ', HttpStatus.UNAUTHORIZED);
        const item = await this.getItemByID(itemID);
        await this.update(itemID, { ifDone: item.ifDone ? false : true });
        return item.ifDone ? false : true;
    }
    async updateItem(userID, itemID, updateItemDto: UpdateDto) {
        if (!await this.UserService.checkUserHaveItem(userID, itemID))
            throw new HttpException('you do not have this item ', HttpStatus.UNAUTHORIZED);
        const item = await this.getItemByID(itemID);
        //await this.checkUpdateItemData(updateItemDto);
        if (updateItemDto.description)
            await this.update(itemID, { description: updateItemDto.description });
        if (updateItemDto.name)
            await this.update(itemID, { name: updateItemDto.name });
        if (updateItemDto.toDoDate)
            await this.update(itemID, { toDoDate: updateItemDto.toDoDate });
        if (updateItemDto.endTime)
            await this.update(itemID, { endTime: updateItemDto.endTime });

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
            if (!item.toDoDate || item.toDoDate == today)
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
            if (!item.ifDone && (!item.toDoDate || item.toDoDate == today))
                items.push(item);
        }
        return items;
    }

    async deleteItem(itemID, userID) {
        const item = await this.getItemByID(itemID);
        if (!await this.UserService.checkUserHaveItem(userID, itemID))
            throw new HttpException('you do not have this item ', HttpStatus.UNAUTHORIZED);
        if (await this.UserService.deleteItemFromUser(userID, itemID))
            if (await this.delete(itemID))
                return true;
            else throw new HttpException('this item not exist ', HttpStatus.UNAUTHORIZED);

    }

    async deleteAllUserItems(userID) {
        const itemsIDs = await this.UserService.getUserItem(userID);
        for (let i = 0; i < itemsIDs.length; i++) {
            await this.delete(itemsIDs[i]);
        }
    }

}
