import { Injectable } from '@nestjs/common';
import { Item } from "../models/item.schema";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
@Injectable()
export class ItemBaseService {
    constructor(
        @InjectModel(Item) private readonly itemModel: ReturnModelType<typeof Item>
    ) { }

    async findOneById(id) {
        return await this.itemModel.findOne({ _id: id });
    }

    async findAll() {
        return await this.itemModel.find().exec();
    }

    async create(createItemDto: {
        name: string;
        description?: string;
        toDoDate?: Date;
        ifDone?: boolean;
        endTime?: Number;
    }) {
        const createdItem = new this.itemModel(createItemDto);
        await createdItem.save();
        return createdItem;
    }

    async update(id, updateData: {
        name?: string;
        description?: string;
        toDoDate?: Date;
        endTime?: Number;
        ifDone?: boolean;
    }) {

        await this.itemModel.updateOne({ _id: id }, updateData);
        return 1;
    }

    async delete(id) {
        return await this.itemModel.findOneAndDelete({ _id: id });
    }

}