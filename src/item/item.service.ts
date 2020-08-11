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
export class ItemService {

    constructor(
        private readonly itemRepository: ItemRepository,
        private readonly UserService: UserService
    ) { }

    async getItemByID(id): Promise<Item | null> {
        const item = await this.itemRepository.findByID(id);
        if (!item) {
            throw new HttpException('No item', HttpStatus.FORBIDDEN);
        }
        return item;
    }

    async getUserItem(userID, itemID): Promise<Item> {
        if (!await this.UserService.checkUserHaveItem(userID, itemID))
            throw new HttpException('you do not have this item ', HttpStatus.UNAUTHORIZED);
        return await this.getItemByID(itemID);
    }
    async createItem(createItemDto: CreateDto, userID): Promise<Item> {
        const user = await this.UserService.getUserByID(userID);
        if (!user)
            throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
        const createdItem = await this.itemRepository.create(createItemDto);
        await this.UserService.addItemToUser(createdItem._id, userID);
        return createdItem;
    }
    async toggleIsDone(userID, itemID) {
        if (!await this.UserService.checkUserHaveItem(userID, itemID))
            throw new HttpException('you do not have this item ', HttpStatus.UNAUTHORIZED);
        const item = await this.getItemByID(itemID);
        return await this.itemRepository.toggleISDone(itemID);
    }
    async updateItem(userID, itemID, updateItemDto: UpdateDto) {
        if (!await this.UserService.checkUserHaveItem(userID, itemID))
            throw new HttpException('you do not have this item ', HttpStatus.UNAUTHORIZED);
        const item = await this.getItemByID(itemID);
        return await this.itemRepository.update(itemID, updateItemDto);
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
            console.log(item.ifDone);
            if (item.ifDone)
                items.push(item);
        }
        return items;
    }

    async getUserItemsForThisDay(userId) {
        const itemsIDs = await this.UserService.getUserItem(userId);
        var items = [];
        const today = new Date();
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
            if (await this.itemRepository.delete(itemID))
                return true;
            else throw new HttpException('this item not exist ', HttpStatus.UNAUTHORIZED);

    }

    async deleteAllUserItems(userID) {
        const itemsIDs = await this.UserService.getUserItem(userID);
        for (let i = 0; i < itemsIDs.length; i++) {
            await this.itemRepository.delete(itemsIDs[i]);
        }
    }

}
