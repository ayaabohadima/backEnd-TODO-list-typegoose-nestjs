import { Injectable } from '@nestjs/common';
import { Item } from "../models/item.schema";
import { BaseRepository } from '../shared/repository/base.service';
import { ModelType } from 'typegoose';
import { InjectModel } from "nestjs-typegoose";

@Injectable()
export class ItemRepository extends BaseRepository<Item>  {
    constructor(
        @InjectModel(Item) private readonly _itemModel: ModelType<Item>
    ) {
        super();
        this._Model = _itemModel;
    }

    async toggleISDone(itemID) {
        const item = await this.findByID(itemID);
        await this.update(itemID, { ifDone: item.ifDone ? false : true });
        return item.ifDone ? false : true;
    }

}
