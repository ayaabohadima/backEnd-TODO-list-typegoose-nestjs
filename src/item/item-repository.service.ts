import { Injectable } from '@nestjs/common';
import { ReturnModelType } from "@typegoose/typegoose";
import { Item } from "../models/item.schema";

import { IRead } from '../shared/repository-interfaces/IRead'
import { IWrite } from '../shared/repository-interfaces/IWrite'
import { UpdateDto } from './dto/update.dto';
import { CreateDto } from './dto/create.dto';

export abstract class ItemRepository implements IWrite<Item>, IRead<Item>  {
    itemModel: ReturnModelType<typeof Item>;
    async findOne(files: {}) {
        return await this.itemModel.findOne(files);
    }
    async findAll() {
        return await this.itemModel.find().exec();
    }

    async find(files: {}) {
        return await this.itemModel.find(files).exec();
    }

    async create(createItem: CreateDto) {
        const createdItem = new this.itemModel(createItem);
        await createdItem.save();
        return createdItem;
    }

    async update(id, updateInfo: UpdateDto) {
        if (await this.itemModel.updateOne({ _id: id }, updateInfo))
            return true;
        return false;
    }

    async delete(id) {
        if (await this.itemModel.findOneAndDelete({ _id: id }))
            return true;
        return false;
    }

}